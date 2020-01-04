/* eslint global-require: 0 */
/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const { debug } = require('common/logger');

const chai = require('chai');
const chaiString = require('chai-string');
const fetch = require('node-fetch');
const _ = require('underscore');
const firstTenExpectedCommits = require('../data/first10CommitsHere.json');

const { expect } = chai;
chai.use(chaiString);

// This will start the API server on a port not in use by the dev server
const testPort = 11967;
process.env.GT_API_PORT = testPort;
require('../../src/server');

const historyUrl = `http://localhost:${testPort}/git-temporal/history`;
const rangeUrl = `http://localhost:${testPort}/git-temporal/commitRange`;
const testPath = 'packages/api-node-express';
const testPathFile = 'packages/api-node-express/src/server.ts';

function expectCommitsEql(
  commitA,
  commitB,
  omissions = ['relativeDate', 'index']
) {
  const commitAComp = _.omit(commitA, omissions);
  const commitBComp = _.omit(commitB, omissions);
  expect(commitAComp).to.eql(commitBComp);
}

describe('git-temporal/history API', async () => {
  let allCommits;
  let directoryCommits;
  let fileCommits;

  before(async () => {
    const fetchResult = await fetch(historyUrl);
    allCommits = await fetchResult.json();
    debug(
      'got commits',
      JSON.stringify(allCommits.commits.map(c => c.id), null, 2)
    );
    // console.log('first commit', allCommits.commits[0]);
    // console.log('last commit', allCommits.commits.slice(-1));
  });
  before(async () => {
    const fetchResult = await fetch(`${historyUrl}?path=${testPath}`);
    directoryCommits = await fetchResult.json();
  });
  before(async () => {
    const fetchResult = await fetch(`${historyUrl}?path=${testPathFile}`);
    fileCommits = await fetchResult.json();
  });

  describe('when fetched for whole git-temporal repo', () => {
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
        expectCommitsEql(firstTenExpectedCommits[i], lastTenCommits[i]);
      }
    });
  });

  describe('when fetched for a specific directory', () => {
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
    it('should have fewer commits for a file than the directory it is in', () => {
      expect(fileCommits.commits.length).to.be.below(
        directoryCommits.commits.length
      );
    });
    it(`should only have files for ${testPathFile}`, () => {
      for (const commit of fileCommits.commits) {
        expect(commit.files.length).to.equal(1);
        expect(commit.files[0].name).to.equal(testPathFile);
      }
    });
  });

  describe('when fetched for a specific range', () => {
    let rangeOfCommits;
    before(async () => {
      const fetchResult = await fetch(`${historyUrl}?skip=5&maxCount=10`);
      rangeOfCommits = await fetchResult.json();
    });
    it('should have exactly 10 commits', () => {
      expect(rangeOfCommits.commits.length).to.be.equal(10);
    });
    it('the first commit returned should be allcommits[5]', () => {
      expect(rangeOfCommits.commits[0]).to.eql(allCommits.commits[5]);
    });
  });

  describe('when commit range is fetched', () => {
    let commitRange;
    before(async () => {
      const fetchResult = await fetch(`${rangeUrl}?path=.`);
      commitRange = await fetchResult.json();
      debug('commitRange', commitRange);
    });
    it('should jive with all all commits', () => {
      expect(commitRange.count).to.equal(allCommits.commits.length);

      // remember: allCommits are in reverse temporal order
      expectCommitsEql(commitRange.lastCommit, allCommits.commits[0]);
      expectCommitsEql(
        commitRange.firstCommit,
        allCommits.commits.slice(-1)[0]
      );
    });
  });
});
