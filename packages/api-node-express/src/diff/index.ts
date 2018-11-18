import child_process from 'child_process';
import fs from 'fs';

import { timeThis } from '../common/timeThis';
import { escapeForCli } from '../common/escapeForCli';

interface IFetchContents {
  contents: string;
  isDirectory: boolean;
}

export function serveDiff(req, res) {
  const requestPath = req.query.path || '.';
  const leftCommit = req.query.leftCommit || 'HEAD';
  const rightCommit = req.query.rightCommit || 'local';

  console.log(`fetching diffs`, requestPath, leftCommit, rightCommit);
  const { time, result: response } = timeThis(() => {
    const { contents: leftFileContents, isDirectory } = fetchContents(
      leftCommit,
      requestPath
    );
    const { contents: rightFileContents } = fetchContents(
      rightCommit,
      requestPath
    );

    return {
      isDirectory,
      leftCommit,
      leftFileContents,
      rightCommit,
      rightFileContents,
      path: requestPath,
      rawDiff: fetchDiff(leftCommit, rightCommit, requestPath, isDirectory),
    };
  });
  console.log(`done in ${time}ms`, requestPath, leftCommit, rightCommit);
  res.send(response);
}

function fetchContents(commitId, requestPath): IFetchContents {
  return commitId === 'local'
    ? fetchFromLocal(requestPath)
    : fetchFromGit(commitId, requestPath === '.' ? './' : requestPath);
}

function fetchFromGit(commitId, requestPath): IFetchContents {
  // use -- fileName and git log will work on deleted files and paths
  const cmd = `git show ${commitId}:${escapeForCli(requestPath)}`;
  if (process.env.DEBUG === '1') {
    console.warn(`$ ${cmd}`);
  }
  const rawContents = child_process
    .execSync(cmd, {
      stdio: 'pipe',
    })
    .toString();
  const isDirectory = rawContents.match(/^tree /) !== null;
  return {
    isDirectory,
    contents: isDirectory ? null : Buffer.from(rawContents).toString('base64'),
  };
}

function fetchFromLocal(requestPath): IFetchContents {
  if (!fs.existsSync(requestPath)) {
    return { contents: null, isDirectory: false };
  }
  const isDirectory = fs.statSync(requestPath).isDirectory();
  const returnValue: IFetchContents = {
    isDirectory,
    contents: null,
  };
  if (!isDirectory) {
    returnValue.contents = fs.readFileSync(requestPath).toString('base64');
  }
  return returnValue;
}

function fetchDiff(leftCommit, rightCommit, requestPath, isDirectory) {
  const isDiffOnLocal = rightCommit === 'local';
  const leftPath = isDiffOnLocal ? leftCommit : `${leftCommit}:${requestPath}`;
  const rightPath = isDiffOnLocal
    ? requestPath
    : `${rightCommit}:${requestPath}`;
  const extraOpts = isDirectory ? '--stat=10000 --compact-summary' : '';
  const outputBuffer = child_process.execSync(
    `git diff ${extraOpts} ${leftPath} ${rightPath}`
  );
  return outputBuffer.toString('base64');
}
