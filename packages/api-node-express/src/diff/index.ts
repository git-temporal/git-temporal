import child_process from 'child_process';
import fs from 'fs';
import os from 'os';

import { timeThis } from '../common/timeThis';
import { escapeForCli } from '../common/escapeForCli';

interface IFetchContents {
  contents: string;
  isDirectory: boolean;
}

interface IModifiedFile {
  path: string;
  delta: number;
  status: string;
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

    const modifiedFiles: IModifiedFile[] =
      isDirectory && fetchDirectoryDiff(leftCommit, rightCommit, requestPath);

    return {
      isDirectory,
      leftCommit,
      leftFileContents,
      rightCommit,
      rightFileContents,
      modifiedFiles,
      path: requestPath,
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

function fetchDirectoryDiff(
  leftCommit,
  rightCommit,
  requestPath
): IModifiedFile[] {
  const isDiffOnLocal = rightCommit === 'local';
  const leftPath = isDiffOnLocal ? leftCommit : `${leftCommit}:${requestPath}`;
  const rightPath = isDiffOnLocal
    ? requestPath
    : `${rightCommit}:${requestPath}`;
  const extraOpts = '--stat=300 --compact-summary';
  let outputLines = [];
  try {
    const outputBuffer = child_process.execSync(
      `git diff ${extraOpts} ${leftPath} ${rightPath}`
    );
    outputLines = outputBuffer.toString().split(os.EOL);
  } catch (e) {
    // TODO : test for specific error and only ignore doesn't exist in rev errors
    console.log('Error retrieving git diff', e);
  }
  return parseDirectoryDiff(outputLines);
}

function parseDirectoryDiff(outputLines): IModifiedFile[] {
  const modifiedFiles = [];

  for (const line of outputLines) {
    let matches = line.match(/(.*)\((gone|new)\).*\|\s*(\d*)/);
    if (matches) {
      const [fileName, newOrGone, delta] = matches.slice(1);
      const status = newOrGone === 'new' ? 'added' : 'deleted';
      modifiedFiles.push(makeFile(fileName, delta, status));
    } else {
      matches = line.match(/^([^\|]*)\|\s*(\d*)/);
      if (matches) {
        const [fileName, delta] = matches.slice(1);
        modifiedFiles.push(makeFile(fileName, delta));
      }
    }
  }
  return modifiedFiles.sort(fileNameComparator);
}

function makeFile(fileName, delta, status = 'modified') {
  return {
    status,
    path: fileName.trim(),
    delta: parseInt(delta, 10),
  };
}

function fileNameComparator(a, b) {
  return a.path.localeCompare(b.path);
}
