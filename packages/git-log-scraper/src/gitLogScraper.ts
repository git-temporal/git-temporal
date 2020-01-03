import child_process from 'child_process';
import * as fs from 'fs';
import {
  findGitRoot,
  escapeForCli,
  safelyParseInt,
} from '@git-temporal/commons';
import { debug, setPrefix } from '@git-temporal/logger';

setPrefix('git-log-scraper');

const parsedAttributes = {
  id: '%H%n',
  hash: '%h%n',
  authorName: '%an%n',
  authorEmail: '%ae%n',
  relativeDate: '%cr%n',
  authorDate: '%at%n',
  message: '%s%n',
  body: '%b',
};

export function getCommitHistory(
  path: string,
  options = { skip: 0, maxCount: 0 }
) {
  const { skip, maxCount } = options;
  const rawLog = fetchFileHistory(path, skip, maxCount);
  const commits = parseGitLogOutput(rawLog)
    .sort((a, b) => {
      return b.authorDate - a.authorDate;
    })
    .map((c, i) => ({ ...c, index: skip + i }));

  const isFile = fs.existsSync(path) && !fs.lstatSync(path).isDirectory();

  return {
    isFile,
    commits,
    skip,
    maxCount,
    path,
  };
}

export function getCommitRange(fileName: string) {
  const gitRoot = findGitRoot(fileName);
  const logFlags = gitLogFlags({ follow: false });

  debug('getCommitRange', { fileName, logFlags });

  const cmdFileName = fileName === gitRoot ? '.' : fileName;
  const allRevHashes = execGitCommand(
    gitRoot,
    `git rev-list --single-worktree --ignore-missing --topo-order --no-merges HEAD -- ${escapeForCli(
      cmdFileName
    )}`
  )
    .split('\n')
    .filter(l => l.length > 0);

  debug('allRevHashes', allRevHashes);

  const firstCommitRaw = execGitCommand(
    gitRoot,
    `git log ${logFlags} -n1 ${allRevHashes[allRevHashes.length - 1]}`
  );
  const firstCommit = parseGitLogOutput(firstCommitRaw)[0];

  const lastCommitRaw = execGitCommand(
    gitRoot,
    `git log ${logFlags} -n 1 -- ${escapeForCli(fileName)}`
  );
  const lastCommit = parseGitLogOutput(lastCommitRaw)[0];

  return {
    firstCommit,
    lastCommit,
    count: allRevHashes.length,
    path: fileName,
  };
}

// Implementation

function execGitCommand(gitRoot: string, cmd: string): string {
  debug(`$ ${cmd}`);
  return child_process
    .execSync(cmd, {
      cwd: gitRoot,
      stdio: 'pipe',
      maxBuffer: 10 * 1024 * 1024,
    })
    .toString();
}

function fetchFileHistory(fileName: string, skip: number, maxCount: number) {
  const gitRoot = findGitRoot(fileName);
  const flags = gitLogFlags();
  const skipFlag = skip ? ` --skip=${skip}` : '';
  const countFlag = maxCount ? ` -n ${maxCount}` : '';

  // use -- fileName and git log will work on deleted files and paths
  return execGitCommand(
    gitRoot,
    `git log ${flags}${skipFlag}${countFlag} -- ${escapeForCli(fileName)}`
  );
}

function gitLogFlags(options = { follow: true }) {
  let format = '';
  for (const attr in parsedAttributes) {
    format += `${attr}:${parsedAttributes[attr]}`;
  }
  const follow = options.follow ? ' --follow' : '';
  return `--pretty=\"format:${format}\" --topo-order --date=local --numstat ${follow}`;
}

function parseGitLogOutput(output) {
  const logItems = [];
  const logLines = output.split(/\n\r?/);
  let commitIndex = 0;

  let currentlyParsingAttr = null;
  let parsedValue = null;

  let commitObj = null;
  let totalLinesAdded = 0;
  let totalLinesDeleted = 0;
  // let lineNumber = 0;

  const addLogItem = () => {
    if (!commitObj) {
      return;
    }
    commitObj.linesAdded = totalLinesAdded;
    commitObj.linesDeleted = totalLinesDeleted;
    commitObj.index = commitIndex;
    logItems.push(commitObj);

    totalLinesAdded = 0;
    totalLinesDeleted = 0;
    commitIndex += 1;
  };

  for (const line of logLines) {
    // lineNumber += 1;
    let matches = line.match(/^id\:(.*)/);
    if (matches) {
      currentlyParsingAttr = 'id';
      addLogItem();
      commitObj = {
        id: matches[1],
        files: [],
        body: '',
        message: '',
      };
      continue;
    }
    matches = line.match(/^([^\:]+):(.*)/);
    if (matches) {
      let attr: string;
      [, attr, parsedValue] = matches;
      if (attr === 'authorDate') {
        parsedValue = parseInt(parsedValue, 10);
      }
      if (Object.keys(parsedAttributes).includes(attr)) {
        currentlyParsingAttr = attr;
        commitObj[currentlyParsingAttr] = parsedValue;
        continue;
      }
    }
    if ((matches = line.match(/^([\d\-]+)\s+([\d\-]+)\s+(.*)/))) {
      let [linesAdded, linesDeleted, fileName] = matches.slice(1);
      linesAdded = safelyParseInt(linesAdded);
      linesDeleted = safelyParseInt(linesDeleted);
      fileName = fileName.trim();
      currentlyParsingAttr = 'files';

      totalLinesAdded += linesAdded;
      totalLinesDeleted += linesDeleted;
      commitObj.files.push({
        linesAdded,
        linesDeleted,
        name: fileName,
      });
    } else if (currentlyParsingAttr === 'body') {
      commitObj.body += `<br>${line}`;
    }
  }
  if (commitObj) {
    addLogItem();
  }
  return logItems;
}
