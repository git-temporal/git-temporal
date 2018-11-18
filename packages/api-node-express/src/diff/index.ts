import child_process from 'child_process';
import fs from 'fs';
import os from 'os';

import { timeThis } from '../common/timeThis';
import { escapeForCli } from '../common/escapeForCli';
import { isGitIgnored } from '../common/isGitIgnored';

export function serveDiff(req, res) {
  const requestPath = req.query.path || '.';
  const leftCommit = req.query.leftCommit || 'HEAD';
  const rightCommit = req.query.rightCommit || 'local';

  console.log(`fetching diffs`, requestPath, leftCommit, rightCommit);

  const { time, result: response } = timeThis(() => {
    return {
      leftCommit,
      rightCommit,
      path: requestPath,
      leftContents: fetchContents(leftCommit, requestPath),
      rightContents: fetchContents(rightCommit, requestPath),
    };
  });
  console.log(`done in ${time}ms`, requestPath, leftCommit, rightCommit);
  res.send(response);
}

function fetchContents(commitId, requestPath): object[] | string {
  return commitId === 'local'
    ? fetchFromLocal(requestPath)
    : fetchFromGit(commitId, requestPath === '.' ? './' : requestPath);
}

function fetchFromGit(commitId, requestPath): object[] | string {
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
  debugger;
  return rawContents.match(/^tree /)
    ? processGitDirShow(rawContents)
    : Buffer.from(rawContents).toString('base64');
}

function fetchFromLocal(requestPath) {
  if (!fs.existsSync(requestPath)) {
    return [];
  }
  let contents: string | object[] = [];
  if (fs.statSync(requestPath).isDirectory()) {
    contents = readLocalGitFiles(requestPath);
  } else {
    contents = fs.readFileSync(requestPath).toString('base64');
  }

  return contents;
}

function processGitDirShow(rawContents) {
  const filteredLines = rawContents.split(os.EOL).filter((line, index) => {
    return index !== 0 && line.trim() !== '';
  });

  return filteredLines.map(line => {
    return { name: line.trim() };
  });
}

function readLocalGitFiles(requestPath) {
  const filteredLines = fs.readdirSync(requestPath).filter(line => {
    return !isGitIgnored(line);
  });

  return filteredLines.map(line => {
    return { name: line.trim() };
  });
}
