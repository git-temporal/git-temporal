import fs from 'fs';
import os from 'os';
import path from 'path';

import { escapeForCli, execSync, findGitRoot } from '@git-temporal/commons';
import { createProxies } from '@git-temporal/logger';

const { debug, error } = createProxies('git-diff-scraper');

interface IFetchContents {
  contents: string;
  isDirectory: boolean;
  error?: string;
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
  const gitRoot = findGitRoot(requestPath);
  const normalizedRequestPath = normalizeRequestPath(gitRoot, requestPath);

  debug('getDiff', requestPath, _leftCommit, _rightCommit);
  const { contents: leftFileContents, isDirectory } = fetchContents(
    _leftCommit,
    normalizedRequestPath,
    gitRoot
  );
  const { contents: rightFileContents } = fetchContents(
    _rightCommit,
    normalizedRequestPath,
    gitRoot
  );

  const modifiedFiles: IModifiedFile[] =
    isDirectory &&
    fetchDirectoryDiff(leftCommit, rightCommit, normalizedRequestPath, gitRoot);

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

function fetchContents(commitId, requestPath, gitRoot): IFetchContents {
  debug('fetchContents', { commitId, requestPath, gitRoot });
  return commitId === 'local'
    ? fetchFromLocal(requestPath, gitRoot)
    : fetchFromGit(commitId, requestPath === '.' ? './' : requestPath, gitRoot);
}

function fetchFromGit(commitId, requestPath, gitRoot): IFetchContents {
  // use -- fileName and git log will work on deleted files and paths
  const cmd = `show ${commitId}:${escapeForCli(requestPath)}`;
  try {
    const rawContents = execGit(gitRoot, cmd).toString();
    const isDirectory = rawContents.match(/^tree /) !== null;
    return {
      isDirectory,
      contents: isDirectory
        ? null
        : Buffer.from(rawContents).toString('base64'),
    };
  } catch (e) {
    error(
      'error executing git',
      process.cwd,
      e.status,
      Buffer.from(e.stderr).toString('base64')
    );
    return {
      isDirectory: false,
      contents: null,
      error: e.status,
    };
  }
}

function fetchFromLocal(relativePath, gitRoot): IFetchContents {
  const requestPath = path.join(gitRoot, relativePath);
  debug('fetchFromLocal', { requestPath });

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
  requestPath,
  gitRoot
): IModifiedFile[] {
  const path = requestPath === '.' ? './' : requestPath;
  const isDiffOnLocal = rightCommit === 'local';
  const leftPath = isDiffOnLocal ? leftCommit : `${leftCommit}:${path}`;
  const rightPath = isDiffOnLocal ? path : `${rightCommit}:${path}`;
  const extraOpts = '--stat=300 --compact-summary';
  let outputLines = [];
  try {
    const outputBuffer = execGit(
      gitRoot,
      `diff ${extraOpts} ${leftPath} ${rightPath}`
    );
    outputLines = outputBuffer.toString().split(os.EOL);
  } catch (e) {
    // TODO : test for specific error and only ignore doesn't exist in rev errors
    error('Error retrieving git diff', e);
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
  if (gitRoot === requestPath) {
    return './';
  }
  const parsedRequestPath = path.parse(requestPath);
  if (parsedRequestPath.root === '') {
    // it's already a relative path
    return requestPath;
  }

  const relativeDir = parsedRequestPath.dir.slice(gitRoot.length + 1);
  debug(
    `normalizeRequestPath ${gitRoot},
      ${relativeDir},
      ${parsedRequestPath.dir},
      ${parsedRequestPath.base}`
  );
  return path.join(relativeDir, parsedRequestPath.base);
}

function execGit(gitRoot, gitCmd) {
  return execSync(`git ${gitCmd}`, { cwd: gitRoot, logFn: debug });
}
