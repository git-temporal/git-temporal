import child_process from 'child_process';
import * as fs from 'fs';
import { findGitRoot, escapeForCli } from '@git-temporal/commons';
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

export function getCommitHistory(fileName) {
  const rawLog = fetchFileHistory(fileName);
  const commits = parseGitLogOutput(rawLog).sort((a, b) => {
    return b.authorDate - a.authorDate;
  });
  const isFile =
    fs.existsSync(fileName) && !fs.lstatSync(fileName).isDirectory();

  return {
    isFile,
    commits,
    path: fileName,
  };
}

export function getCommitRange(fileName) {
  const gitRoot = findGitRoot(fileName);
  const logFlags = gitLogFlags({ follow: false });

  debug('getCommitRange', { fileName, logFlags });

  const allRevHashes = execGitCommand(
    gitRoot,
    `git rev-list HEAD -- ${fileName}`
  )
    .split('\n')
    .filter(l => l.length > 0);

  debug('allRevHashes', allRevHashes);

  const firstCommitRaw = execGitCommand(
    gitRoot,
    `git log ${logFlags} -n1 ${allRevHashes[allRevHashes.length - 1]}`
  );
  const firstCommit = parseGitLogOutput(firstCommitRaw);

  const lastCommitRaw = execGitCommand(
    gitRoot,
    `git log ${logFlags} -n 1 -- ${escapeForCli(fileName)}`
  );
  const lastCommit = parseGitLogOutput(lastCommitRaw);

  return {
    firstCommit,
    lastCommit,
    count: allRevHashes.length,
  };
}

// Implementation

function execGitCommand(gitRoot: string, cmd: string): string {
  debug(`$ ${cmd}`);
  return child_process
    .execSync(cmd, { cwd: gitRoot, stdio: 'pipe' })
    .toString();
}

function fetchFileHistory(fileName) {
  const gitRoot = findGitRoot(fileName);
  const flags = gitLogFlags();
  // use -- fileName and git log will work on deleted files and paths
  return execGitCommand(
    gitRoot,
    `git log ${flags} -- ${escapeForCli(fileName)}`
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

function safelyParseInt(parseableNumber) {
  if (parseableNumber === null || parseableNumber === undefined) {
    return 0;
  }
  const parsedNumber = parseInt(parseableNumber, 10);
  if (isNaN(parsedNumber)) {
    return 0;
  }

  return parsedNumber;
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
