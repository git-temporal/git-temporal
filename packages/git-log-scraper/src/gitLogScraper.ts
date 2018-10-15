import child_process from 'child_process';

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
  const rawLog = fetchFileHistory(fileName);
  return parseGitLogOutput(rawLog);
}

// Implementation

function fetchFileHistory(fileName) {
  const format = (
    '{"id": "%H", "authorName": "%an", "authorEmail": "%ae", "relativeDate": "%cr", "authorDate": %at, ' +
    ' "message": "%s", "body": "%b", "hash": "%h"}'
  ).replace(/\"/g, '#/dquotes/');
  const flags = ` --pretty=\"format:${format}\" --topo-order --date=local --numstat --follow`;

  // use -- fileName and git log will work on deleted files and paths
  const cmd = `git log${flags} -- ${escapeForCli(fileName)}`;
  if (process.env.DEBUG === '1') {
    console.warn(`$ ${cmd}`);
  }
  return child_process
    .execSync(cmd, {
      stdio: 'pipe',
    })
    .toString();
}

function parseGitLogOutput(output) {
  const logItems = [];
  const logLines = output.split('\n');
  let currentCommitText = null;
  let totalLinesAdded = 0;
  let totalLinesDeleted = 0;
  let files = [];

  function addLogItem() {
    const commitObj = parseCommitObj(currentCommitText);
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

  for (const line of logLines) {
    let matches;
    if (line.match(/^\{\#\/dquotes\/id\#\/dquotes\/\:/)) {
      if (currentCommitText != null) {
        addLogItem();
      }
      currentCommitText = line;
    } else if ((matches = line.match(/^([\d\-]+)\s+([\d\-]+)\s+(.*)/))) {
      let [linesAdded, linesDeleted, fileName] = matches.slice(1);
      linesAdded = safelyParseInt(linesAdded);
      linesDeleted = safelyParseInt(linesDeleted);
      fileName = fileName.trim();

      totalLinesAdded += linesAdded;
      totalLinesDeleted += linesDeleted;
      files.push({
        linesAdded,
        linesDeleted,
        name: fileName,
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

function parseCommitObj(line) {
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
    console.warn(`#{line}\n\n`);
    console.warn(`failed to parse JSON ${encLine}`);
    return null;
  }
}

/*
    See nodejs path.normalize().  This method extends path.normalize() to add:
    - escape of space characters 
*/
function escapeForCli(filepath) {
  return filepath.replace(
    /([\s\(\)\-])/g,
    `#{process.platform === 'win32' ? '^' : '\\'}#{$1}`
  );
}
