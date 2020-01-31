import * as path from 'path';

import { getDiff } from './gitDiffScraper';
import { findGitRoot, execSync } from '@git-temporal/commons';
import { debug } from '@git-temporal/logger';

const gitRoot = findGitRoot('.');
const testFile = path.join(gitRoot, 'package.json');

// first 10 commits to this repo
const firstRootCommitHashes = getFirstCommitHashes(gitRoot);
const firstFileCommitHashes = getFirstCommitHashes(testFile);

debug('firstRootCommitHashes', firstRootCommitHashes);
debug('firstFileCommitHashes', firstFileCommitHashes);

describe('git-diff-scraper', () => {
  it('should return a directory when path is a directory', () => {
    const diff = getDiff(gitRoot);
    expect(diff.isDirectory).toEqual(true);
  });

  it('should return a file when path is a file', () => {
    const diff = getDiff(testFile);
    expect(diff.isDirectory).toEqual(false);
  });

  it('should return HEAD and local changes when commits are null', () => {
    const diff = getDiff(gitRoot);
    expect(diff.leftCommit).toEqual('HEAD');
    expect(diff.rightCommit).toEqual('local');
  });

  it('should return directory differences for two commits', () => {
    const diff = getDiff(
      gitRoot,
      // two random commmits
      firstRootCommitHashes[1],
      firstRootCommitHashes[8]
    );
    expect(diff).toMatchSnapshot();
    expect(diff.isDirectory).toEqual(true);
    expect(diff.leftFileContents).toBeFalsy();
    expect(diff.leftFileContents).toBeFalsy();
    expect(diff.modifiedFiles.length).toBeGreaterThan(0);
  });

  it('should return file differences for two commits', () => {
    const diff = getDiff(
      testFile,
      // two random commits
      firstFileCommitHashes[1],
      firstFileCommitHashes[8]
    );
    expect(diff).toMatchSnapshot();
    expect(diff.isDirectory).toEqual(false);
    expect(diff.leftFileContents).toBeTruthy();
    expect(diff.leftFileContents).toBeTruthy();
    expect(diff.modifiedFiles.length).toBeFalsy();
  });

  // it('should match snapshot from directory diff ');
});

function getFirstCommitHashes(dir) {
  return execSync(
    `git log --pretty="format:%H" --topo-order --date=local ${dir}`
  )
    .split('\n')
    .slice(-10)
    .reverse();
}
