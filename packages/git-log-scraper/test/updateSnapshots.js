#!/usr/bin/env node
require('../babel-register');

const fs = require('fs');
const path = require('path');

const { getCommitHistory } = require(`../src/gitLogScraper`);

const testRepoBaseDir = path.resolve(__dirname, 'repos');
const snapshotDir = path.resolve(__dirname, 'snapshots');

if (!fs.existsSync(testRepoBaseDir)) {
  require('./pullTestRepos');
}

console.log(
  '\nUpdating test/repos snapshots.  This will take a few minutes...\n'
);

const isDirectory = source =>
  fs.lstatSync(path.join(testRepoBaseDir, source)).isDirectory();
const directories = fs.readdirSync(testRepoBaseDir).filter(isDirectory);

for (let directory of directories) {
  const fullPath = path.join(testRepoBaseDir, directory);
  console.log(`fetching git commit history for ${fullPath}`);
  const commitHistory = getCommitHistory(fullPath);
  const outFilePath = path.join(snapshotDir, `${directory}.snapshot.json`);
  console.log(`saving to ${outFilePath}`);
  fs.writeFileSync(outFilePath, JSON.stringify(commitHistory, null, 2));
}

console.log('Done updating test/snapshots');
