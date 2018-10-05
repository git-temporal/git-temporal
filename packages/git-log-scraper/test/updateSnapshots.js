#!/usr/bin/env node
/* eslint global-require: 0 */
/* eslint no-console: 0 */

/*
  This script updates the snapshot files in test/snapshots

*/
require('../../../babel-register');
const fs = require('fs');
const path = require('path');

const { getCommitHistory } = require(`../src/gitLogScraper`);

const {
  testRepoBaseDir,
  snapshotDir,
  getTestRepoDirectories,
} = require('./helpers/testDirectories');

if (!fs.existsSync(testRepoBaseDir)) {
  require('./pullTestRepos');
}

console.log(
  '\nUpdating test/repos snapshots.  This will take a few minutes...\n'
);

const directories = getTestRepoDirectories();

for (const directory of directories) {
  const fullPath = path.join(testRepoBaseDir, directory);
  console.log(`fetching git commit history for ${fullPath}`);
  const commitHistory = getCommitHistory(fullPath);
  const outFilePath = path.join(snapshotDir, `${directory}.snapshot.json`);
  console.log(`saving to ${outFilePath}`);
  fs.writeFileSync(outFilePath, JSON.stringify(commitHistory, null, 2));
}

console.log('Done updating test/snapshots');
