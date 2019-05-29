import child_process from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { escapeForCli, findGitRoot } from '@git-temporal/commons';
import { debug, setPrefix } from '@git-temporal/logger';

setPrefix('git-diff-scraper');

interface IFetchContents {
  contents: string;
  isDirectory: boolean;
}

interface IModifiedFile {
  path: string;
  delta: number;
  status: string;
}

export function getDiff(
  requestPath: string = '.',
  leftCommit?: string,
  rightCommit?: string
) {
  const _leftCommit = leftCommit || 'HEAD';
  const _rightCommit = rightCommit || 'local';
  debug('getDiff', requestPath, _leftCommit, _rightCommit);
  const { contents: leftFileContents, isDirectory } = fetchContents(
    _leftCommit,
    requestPath
  );
  const { contents: rightFileContents } = fetchContents(
    _rightCommit,
    requestPath
  );

  const modifiedFiles: IModifiedFile[] =
    isDirectory && fetchDirectoryDiff(leftCommit, rightCommit, requestPath);

  return {
    isDirectory,
    leftFileContents,
    rightFileContents,
    modifiedFiles,
    rightCommit: _rightCommit,
    leftCommit: _leftCommit,
    path: requestPath,
  };
}

// Implementation

function fetchContents(commitId, requestPath): IFetchContents {
  return commitId === 'local'
    ? fetchFromLocal(requestPath)
    : fetchFromGit(commitId, requestPath === '.' ? './' : requestPath);
}

function fetchFromGit(commitId, requestPath): IFetchContents {
  const gitRoot = findGitRoot(requestPath);
  if (gitRoot) {
    debug('changing to gitRoot', gitRoot);
    process.chdir(gitRoot);
  }
  const _requestPath = normalizeRequestPath(gitRoot, requestPath);

  // use -- fileName and git log will work on deleted files and paths
  const cmd = `git show ${commitId}:${escapeForCli(_requestPath)}`;
  debug(`$ ${cmd}`);

  try {
    const rawContents = child_process
      .execSync(cmd, {
        stdio: 'pipe',
      })
      .toString();
    const isDirectory = rawContents.match(/^tree /) !== null;
    return {
      isDirectory,
      contents: isDirectory
        ? null
        : Buffer.from(rawContents).toString('base64'),
    };
  } catch (e) {
    console.error('error executing git', e.status, e);
    return {
      isDirectory: false,
      contents: null,
    };
  }
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
    debug('Error retrieving git diff', e);
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

function normalizeRequestPath(
  gitRoot: string | null,
  requestPath: string
): string {
  if (!gitRoot) {
    return requestPath;
  }
  const parsedRequestPath = path.parse(requestPath);
  if (parsedRequestPath.root === '') {
    // it's already a relative path
    return requestPath;
  }
  const relativeDir = parsedRequestPath.dir.slice(gitRoot.length + 1);
  return path.join(relativeDir, parsedRequestPath.base);
}