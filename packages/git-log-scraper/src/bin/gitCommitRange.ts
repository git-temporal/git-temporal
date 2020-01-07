#!/usr/bin/env node

import { getCommitRange } from '../gitLogScraper';

const HELP = `
Dumps git commit range for a file or directory.

usage:
  node lib/gitCommitRange.js path

`;
debugger;

const path = process.argv[2];
if (!path || path === '--help') {
  console.log(HELP);
  process.exit(1);
}
const commitRange = getCommitRange(path);
console.log(JSON.stringify(commitRange, null, 2));
