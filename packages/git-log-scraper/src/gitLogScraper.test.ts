import * as path from 'path';
import * as _ from 'lodash';
import { findGitRoot } from '@git-temporal/commons';

import { getCommitHistory, getCommitRange } from './gitLogScraper';

const PATH_TO_TEST = 'packages/git-temporal-react';
const FILE_TO_TEST = 'package.json';

const PATH_COMMITS_TO_TEST = 50;
const FILE_COMMITS_TO_TEST = 30;

const gitRoot = findGitRoot('.');

describe('git-log-scraper', () => {
  describe('getCommitHistory()', () => {
    describe('for directory', () => {
      it('should return commit history for our packages directory as relative to root dir', () => {
        const history = getCommitHistory(`./${PATH_TO_TEST}`);
        testHistoryIntegrity(
          history,
          false,
          PATH_COMMITS_TO_TEST,
          PATH_TO_TEST
        );
      });

      // this is necessary for the editor plugins
      it('should return commit history for our packages directory as absolute dir', () => {
        const history = getCommitHistory(path.resolve(gitRoot, PATH_TO_TEST));
        testHistoryIntegrity(
          history,
          false,
          PATH_COMMITS_TO_TEST,
          PATH_TO_TEST
        );
      });
    });

    describe('for file', () => {
      it('should return commit history for our packages directory as relative to root dir', () => {
        const history = getCommitHistory(`./${FILE_TO_TEST}`);
        testHistoryIntegrity(history, true, FILE_COMMITS_TO_TEST, FILE_TO_TEST);
      });

      // this is necessary for the editor plugins
      it('should return commit history for our packages directory as absolute dir', () => {
        const history = getCommitHistory(path.resolve(gitRoot, FILE_TO_TEST));
        testHistoryIntegrity(history, true, FILE_COMMITS_TO_TEST, FILE_TO_TEST);
      });
    });

    describe('with skip and maxCount options', () => {
      it('should return correct numbers of things', () => {
        const fullHistory = getCommitHistory(PATH_TO_TEST);
        expect(fullHistory.commits.length).toBeGreaterThan(
          PATH_COMMITS_TO_TEST
        );

        const first10 = getCommitHistory(PATH_TO_TEST, { maxCount: 10 });
        const remainingCommits = getCommitHistory(PATH_TO_TEST, { skip: 10 });
        expect(first10.commits.length).toEqual(10);
        expect(
          first10.commits.length + remainingCommits.commits.length
        ).toEqual(fullHistory.commits.length);
      });
    });
  });

  describe('getCommitRange()', () => {
    describe('for directory', () => {
      it('should have known first commit and minimum numbers with relative path', () => {
        const filePath = `./${PATH_TO_TEST}`;
        const commitRange = getCommitRange(filePath);
        testRangeIntegrity(commitRange, PATH_COMMITS_TO_TEST, filePath);
      });

      it('should have known first commit and minimum numbers with absolute path', () => {
        const filePath = path.resolve(gitRoot, PATH_TO_TEST);
        const commitRange = getCommitRange(filePath);
        testRangeIntegrity(commitRange, PATH_COMMITS_TO_TEST, filePath);
      });
    });

    describe('for file', () => {
      it('should have known first commit and minimum numbers with relative path', () => {
        const filePath = `./${FILE_TO_TEST}`;
        const commitRange = getCommitRange(filePath);
        testRangeIntegrity(commitRange, FILE_COMMITS_TO_TEST, filePath);
      });

      it('should have known first commit and minimum numbers with absolute path', () => {
        const filePath = path.resolve(gitRoot, FILE_TO_TEST);
        const commitRange = getCommitRange(filePath);
        testRangeIntegrity(commitRange, FILE_COMMITS_TO_TEST, filePath);
      });
    });
  });
});

function testHistoryIntegrity(history, isFile, numberOfCommits, path) {
  expect(history.isFile).toEqual(isFile);
  expectAtLeastNCommits(history, numberOfCommits);
  expectAllCommitFilesFromPath(history, path);
  expectSumLinesAddedAndDeletedToMatchFiles(history);
  expectFirstNToMatchSnapshot(history, numberOfCommits);
}

function testRangeIntegrity(range, numberOfCommits, path) {
  // console.log('testing range on ', path);
  expect(range.gitRoot).toEqual(gitRoot);
  expect(range.count).toBeGreaterThan(numberOfCommits);
  expect(range.path).toEqual(path);
  expect(range.existsLocally).toEqual(true);
  expect(range.firstCommit).toMatchSnapshot();
}

function expectAtLeastNCommits(history, n) {
  expect(history.commits.length).toBeGreaterThan(n);
}

function expectAllCommitFilesFromPath(history, path) {
  const foundIrregularities = [];
  for (const commit of history.commits) {
    for (const file of commit.files) {
      if (!file.name.startsWith(path)) {
        foundIrregularities.push(file);
      }
    }
  }
  expect(foundIrregularities).toEqual([]);
}

function expectSumLinesAddedAndDeletedToMatchFiles(history) {
  const foundIrregularities = [];
  for (const commit of history.commits) {
    let sumAdded = 0;
    let sumDeleted = 0;
    for (const file of commit.files) {
      sumAdded += file.linesAdded;
      sumDeleted += file.linesDeleted;
    }
    if (sumAdded !== commit.linesAdded || sumDeleted !== commit.linesDeleted) {
      foundIrregularities.push(commit);
    }
  }
  expect(foundIrregularities).toEqual([]);
}

function expectFirstNToMatchSnapshot(history, n) {
  const first190 = history.commits
    .slice(0, n)
    .map(obj => _.omit(obj, ['relativeDate']));
  expect(first190).toMatchSnapshot();
}
