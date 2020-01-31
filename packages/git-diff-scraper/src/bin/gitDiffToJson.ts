#!/usr/bin/env node

import { getDiff } from '../gitDiffScraper';

const HELP = `
Dumps git diff json for a file or directory.

usage:
  npx @git-temporal/git-diff-scraper <pathToGitDirOrFile> [leftCommit] [rightCommit]

  If right commit is not specified, will diff against local
  changes in working directory. If left commit not specified,
  uses HEAD commit for file or path.

`;
debugger;

const [path, leftCommit, rightCommit] = process.argv.slice(2);
if (!path || path === '--help') {
  console.log(HELP);
  process.exit(1);
}

const diff = getDiff(path, leftCommit, rightCommit);

console.log(JSON.stringify(diff, null, 2));
