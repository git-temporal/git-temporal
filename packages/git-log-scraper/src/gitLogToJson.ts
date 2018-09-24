#!/usr/bin/env node

import { getCommitHistory } from './gitLogScraper';

const HELP = `
Dumps git log json for a file or directory.

usage: 
  npx @git-temporal/git-log-scraper <pathToGitDirOrFile>

examples:
  # get log data for current directory in a git repo
  npx @git-temporal/git-log-scraper .
  # get log data for a file in a git repo
  npx @git-temporal/git-log-scraper src/someFile.js

`;
debugger;

const path = process.argv[2];
if (!path || path === '--help') {
  console.log(HELP);
  process.exit(1);
}
const commitHistory = getCommitHistory(path);
console.warn(`parsed ${commitHistory.length} commits`);
console.log(JSON.stringify(commitHistory, null, 2));
