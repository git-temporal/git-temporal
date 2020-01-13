import fs from 'fs';
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
    requestPath,
    gitRoot
  );
  const { contents: rightFileContents } = fetchContents(
    _rightCommit,
    requestPath,
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
    ? fetchFromLocal(requestPath)
    : fetchFromGit(commitId, requestPath === '.' ? './' : requestPath, gitRoot);
}

function fetchFromGit(commitId, requestPath, gitRoot): IFetchContents {
  // use -- fileName and git log will work on deleted files and paths
  const [directory, baseFileName] =
    requestPath === gitRoot ||
    requestPath === '' ||
    requestPath.match(/^\.[\\/]?$/)
      ? [gitRoot, '']
      : [path.dirname(requestPath), path.basename(requestPath)];
  debug('fetchFromGit', { requestPath, gitRoot, directory, baseFileName });
  const normalizedRequestPath = normalizeRequestPath(gitRoot, requestPath);
  // Use caution when changing these and be sure to test on Windows.  The
  // `git show` command works a little differently.
  //
  // For example,  `git show HEAD:somepath/somefile.js` from git root will
  // work on OSX but not windows.
  //
  const cmd = `show ${commitId}:./${escapeForCli(normalizedRequestPath)}`;

  let rawContents: string;
  try {
    rawContents = execGit(gitRoot, cmd);
  } catch (e) {
    debug('fetchFromGit', { error });
    return {
      isDirectory: false,
      contents: null,
    };
  }

  const isDirectory = rawContents.match(/^tree /) !== null;
  if (isDirectory) {
    debug('fetchFromGit', { isDirectory, rawContents });
  }

  return {
    isDirectory,
    contents: isDirectory ? null : Buffer.from(rawContents).toString('base64'),
  };
}

function fetchFromLocal(requestPath): IFetchContents {
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
  _leftCommit,
  _rightCommit,
  requestPath,
  gitRoot
): IModifiedFile[] {
  const path = requestPath === '.' ? './' : requestPath;
  const leftCommit = _leftCommit || 'HEAD';
  const rightCommit = _rightCommit || 'local';
  const isDiffOnLocal = rightCommit === 'local';
  const leftPath = leftCommit;
  const rightPath = isDiffOnLocal ? path : `${rightCommit} ${path}`;
  const extraOpts = '--stat=300 --compact-summary';
  let outputLines = [];
  try {
    const outputBuffer = execGit(
      gitRoot,
      `diff ${extraOpts} ${leftPath} ${rightPath}`
    );
    // note below that windows git the output is comes through with \n
    outputLines = outputBuffer.toString().split('\n');
  } catch (e) {
    // TODO : test for specific error and only ignore doesn't exist in rev errors
    error(
      'Error retrieving git diff',
      (e.stderr && e.stderr.toString()) || e.toString()
    );
  }
  return parseDirectoryDiff(outputLines);
}

function parseDirectoryDiff(outputLines): IModifiedFile[] {
  debug('parseDirectoryDiff', outputLines);
  const modifiedFiles = [];
  for (const line of outputLines) {
    let matches = line.match(/(.*)\((gone|new)\).*\|\s*(\d*)/);
    // debug('parsing dir diff line', { line, matches });
    if (matches) {
      const [fileName, newOrGone, delta] = matches.slice(1);
      const status = newOrGone === 'new' ? 'added' : 'deleted';
      modifiedFiles.push(makeFile(fileName, delta, status));
    } else {
      matches = line.match(/^([^|]*)\|\s*(\d*)/);
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
