/* eslint global-require: 0 */
/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const { expect } = require('chai');

const { getCommitHistory } = require(`../../src/gitLogScraper`);

const {
  testRepoBaseDir,
  snapshotDir,
  getTestRepoDirectories,
} = require('../helpers/testDirectories');

if (!fs.existsSync(testRepoBaseDir)) {
  require('../pullTestRepos');
}

const ignoredCommitAttributes = ['relativeDate'];

function timeMe(description, callback) {
  const startTime = Date.now();
  const returnValue = callback();
  const endTime = Date.now();
  console.log(`${description} took ${(endTime - startTime) / 1000}s`);
  return returnValue;
}

function testRepos() {
  const repoDirs = getTestRepoDirectories();
  console.log(repoDirs);
  for (const dir of repoDirs) {
    const fullRepoPath = path.join(testRepoBaseDir, dir);
    const fullSnapshotPath = path.join(snapshotDir, `${dir}.snapshot.json`);
    const commitHistory = timeMe(`getCommitHistory for ${dir}`, () => {
      return getCommitHistory(fullRepoPath);
    });
    const snapshotData = JSON.parse(fs.readFileSync(fullSnapshotPath));

    it(`${dir} getCommitHistory data should have same number of commits as snapshot data`, () => {
      expect(commitHistory.length).to.equal(snapshotData.length);
    });

    it(`${dir} commit history should match snapshot exactly`, () => {
      for (let index = 0; index < commitHistory.length; index++) {
        const testCommit = _.omit(
          commitHistory[index],
          ignoredCommitAttributes
        );
        const snapshotCommit = _.omit(
          snapshotData[index],
          ignoredCommitAttributes
        );
        expect(testCommit).to.eql(snapshotCommit);
      }
    });
  }
}

describe('static test repos', async () => {
  testRepos();
});
