#!/usr/bin/env node

import { getCommitHistory } from './gitLogScraper';
import { safelyParseInt } from '@git-temporal/commons';

const HELP = `
Dumps git log json for a file or directory.

usage:
  npx @git-temporal/git-log-scraper <pathToGitDirOrFile> [skip] [maxCount]

examples:
  # get log data for current directory in a git repo
  npx @git-temporal/git-log-scraper .
  # get log data for a file in a git repo
  npx @git-temporal/git-log-scraper src/someFile.js

`;
debugger;

const [path, skip, maxCount] = process.argv.slice(2);
if (!path || path === '--help') {
  console.log(HELP);
  process.exit(1);
}

const commitHistory = getCommitHistory(path, {
  skip: safelyParseInt(skip),
  maxCount: safelyParseInt(maxCount),
});
console.warn(`parsed ${commitHistory.commits.length} commits`);
console.log(JSON.stringify(commitHistory, null, 2));
