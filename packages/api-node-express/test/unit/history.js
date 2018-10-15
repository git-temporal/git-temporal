/* eslint global-require: 0 */
/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

const chai = require('chai');
const chaiString = require('chai-string');
const fetch = require('node-fetch');
const _ = require('underscore');

const { expect } = chai;
chai.use(chaiString);

// This will start the API server on a port not in use by the dev server
const testPort = 11967;
process.env.GT_API_PORT = testPort;
require('../../src/server');

const historyUrl = `http://localhost:${testPort}/git-temporal/history`;
const firstTenExpectedCommits = require('../data/first10CommitsHere.json');

describe('git-temporal/history API', async () => {
  let allCommits;
  let directoryCommits;
  let fileCommits;
  describe('when fetched for whole git-temporal repo', () => {
    before(async () => {
      const fetchResult = await fetch(historyUrl);
      allCommits = await fetchResult.json();
    });
    it('should have over 30 commits', () => {
      expect(allCommits.commits.length).to.be.above(30);
    });
    it('should be in descending order and match first 10 known commits', () => {
      const lastTenCommits = allCommits.commits.slice(
        allCommits.commits.length - 10
      );
      // since they are returned in descending order the last 10 return would
      // be the first 10 of all time
      for (let i = 0; i < 10; i++) {
        const expectedCommit = _.omit(
          firstTenExpectedCommits[i],
          'relativeDate'
        );
        const actualCommit = _.omit(lastTenCommits[i], 'relativeDate');
        expect(actualCommit).to.eql(expectedCommit);
      }
    });
  });
  describe('when fetched for a specific directory', () => {
    const testPath = 'packages/api-node-express';
    before(async () => {
      const fetchResult = await fetch(`${historyUrl}?path=${testPath}`);
      directoryCommits = await fetchResult.json();
    });
    it('should have fewer commits for a directory than whole repository', () => {
      expect(directoryCommits.commits.length).to.be.below(
        allCommits.commits.length
      );
    });
    it(`should only have files from ${testPath}`, () => {
      for (const commit of directoryCommits.commits) {
        if (!commit.files) {
          continue;
        }
        for (const file of commit.files) {
          expect(file.name).to.startWith(testPath);
        }
      }
    });
  });
  describe('when fetched for a specific file', () => {
    const testPath = 'packages/api-node-express/src/server.ts';
    before(async () => {
      const fetchResult = await fetch(`${historyUrl}?path=${testPath}`);
      fileCommits = await fetchResult.json();
    });
    it('should have fewer commits for a file than the directory it is in', () => {
      expect(fileCommits.commits.length).to.be.below(
        directoryCommits.commits.length
      );
    });
    it(`should only have files for ${testPath}`, () => {
      for (const commit of fileCommits.commits) {
        expect(commit.files.length).to.equal(1);
        expect(commit.files[0].name).to.equal(testPath);
      }
    });
  });
});
