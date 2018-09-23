import ChildProcess from 'child_process';
import Path from 'path';
import Fs from 'fs';

/*
    returns an array of javascript objects representing the commits that effected the requested file
    with line stats, that looks like this:
    [{
        "id": "1c41d8f647f7ad30749edcd0a554bd94e301c651",
        "authorName": "Bee Wilkerson",
        "relativeDate": "6 days ago",
        "authorDate": 1450881433,
        "message": "docs all work again after refactoring to bumble-build",
        "body": "",
        "hash": "1c41d8f",
        "linesAdded": 2,
        "linesDeleted": 2
    }, {
        ...
    }]
*/
export function getCommitHistory(fileName) {
  const rawLog = _fetchFileHistory(fileName);
  return _parseGitLogOutput(rawLog);
}

// Implementation

function _fetchFileHistory(fileName) {
  let directory;
  const format = (
    '{"id": "%H", "authorName": "%an", "relativeDate": "%cr", "authorDate": %at, ' +
    ' "message": "%s", "body": "%b", "hash": "%h"}'
  ).replace(/\"/g, '#/dquotes/');
  const flags = ` --pretty=\"format:${format}\" --topo-order --date=local --numstat --follow`;

  const fstats = Fs.statSync(fileName);
  if (fstats.isDirectory()) {
    directory = fileName;
    fileName = '.';
  } else {
    directory = Path.dirname(fileName);
    fileName = _escapeForCli(Path.basename(fileName));
  }

  const cmd = `git log${flags} ${fileName}`;
  if (process.env.DEBUG === '1') {
    console.warn(`$ ${cmd}`);
  }
  return ChildProcess.execSync(cmd, {
    stdio: 'pipe',
    cwd: directory,
  }).toString();
}

function _parseGitLogOutput(output) {
  const logItems = [];
  const logLines = output.split('\n');
  let currentCommitText = null;
  let totalLinesAdded = 0;
  let totalLinesDeleted = 0;
  let files = [];

  function addLogItem() {
    const commitObj = _parseCommitObj(currentCommitText);
    if (!commitObj) {
      console.warn(`failed to parse commit Object: ${currentCommitText}`);
    } else {
      commitObj.linesAdded = totalLinesAdded;
      commitObj.linesDeleted = totalLinesDeleted;
      commitObj.files = files;
      logItems.push(commitObj);
    }
    totalLinesAdded = 0;
    totalLinesDeleted = 0;
    return (files = []);
  }

  function safelyParseInt(number) {
    if (number === null || number === undefined) {
      return 0;
    }
    const parsedNumber = parseInt(number);
    if (isNaN(parsedNumber)) {
      return 0;
    }

    return parsedNumber;
  }

  for (let line of logLines) {
    var matches;
    if (line.match(/^\{\#\/dquotes\/id\#\/dquotes\/\:/)) {
      if (currentCommitText != null) {
        addLogItem();
      }
      currentCommitText = line;
    } else if ((matches = line.match(/^([\d\-]+)\s+([\d\-]+)\s+(.*)/))) {
      let [linesAdded, linesDeleted, fileName] = matches.slice(1);
      linesAdded = safelyParseInt(linesAdded);
      linesDeleted = safelyParseInt(linesDeleted);
      totalLinesAdded += linesAdded;
      totalLinesDeleted += linesDeleted;
      files.push({
        name: fileName.trim(),
        linesAdded,
        linesDeleted,
      });
    } else if (line != null) {
      currentCommitText += line;
    }
  }

  if (currentCommitText && currentCommitText.length > 0) {
    addLogItem();
  }

  return logItems;
}

function _parseCommitObj(line) {
  const encLine = line
    .replace(/\t/g, '  ') // tabs mess with JSON parse
    .replace(/\"/g, "'") // sorry, can't parse with quotes in body or message
    .replace(/(\n|\n\r)/g, ' <br>')
    .replace(/\r/g, ' <br>')
    .replace(/\#\/dquotes\//g, '"')
    .replace(/\\/g, '\\\\')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
  try {
    return JSON.parse(encLine);
  } catch (error) {
    console.warn(line + '\n\n');
    console.warn(`failed to parse JSON ${encLine}`);
    return null;
  }
}

/*
    See nodejs Path.normalize().  This method extends Path.normalize() to add:
    - escape of space characters 
*/
function _escapeForCli(filePath) {
  const escapePrefix = process.platform === 'win32' ? '^' : '\\';
  return filePath.replace(/([\s\(\)\-])/g, escapePrefix + '$1');
}
