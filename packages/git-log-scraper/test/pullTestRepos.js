#!/usr/bin/env node

fs = require('fs');
path = require('path');

const { testRepoBaseDir } = require('./helpers/testDirectories');

systemCmd = require('bumble-util').systemCmd;

const TEST_REPOS = ['node', 'react', 'atom', 'vscode'];

if (!fs.existsSync(testRepoBaseDir)) {
  fs.mkdirSync(testRepoBaseDir);
  console.log(`
    This is the first time you have run tests! We need to clone and pull the test 
    repositories from @git-temporal.

    Go get a cup of coffee or tea, this will take a few minutes the very first time.
  `);
}

process.chdir(testRepoBaseDir);

for (let repo of TEST_REPOS) {
  // we assume since the test repos are static forks at a point in time that
  // once cloned they should not need to ever be pulled
  if (!fs.existsSync(repo)) {
    console.log(`cloning @git-temnporal/${repo} in test/repos`);
    systemCmd(`git clone https://github.com/git-temporal/${repo}.git ${repo}`);
  }
}

console.log('Done updating test/repos');
