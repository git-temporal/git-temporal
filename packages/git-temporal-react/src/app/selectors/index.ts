import { createSelector } from 'reselect';

import {
  getSelectedPath,
  getHighlightedCommitIds,
  getIsFetching,
  getCommitsContainerSort,
  getAuthorsContainerSort,
  getFilesContainerSort,
  getStartDate,
  getEndDate,
  getRerenderRequestedAt,
  getEarliestCommitDate,
  getLatestCommitDate,
  getTotalCommits,
} from './stateVars';

import { getTimeplotAuthorsAndCommits } from './authors';
import { getFilteredCommits, getCommitsForTimeplot } from './commits';

// The methods exported from this module are intended to provide props for redux
// containers mapStateToProps method and can be passed directly to that method

export const getGitTemporalContainerState = createSelector(
  getSelectedPath,
  getFilteredCommits,
  getIsFetching,
  (selectedPath, commits, isFetching) => ({
    selectedPath,
    commits,
    isFetching,
  })
);

export const getCommitsActionMenuState = createSelector(
  getCommitsContainerSort,
  commitsContainerSort => ({
    commitsContainerSort,
  })
);

export const getAuthorsActionMenuState = createSelector(
  getAuthorsContainerSort,
  authorsContainerSort => ({
    authorsContainerSort,
  })
);

export const getFilesActionMenuState = createSelector(
  getFilesContainerSort,
  filesContainerSort => ({
    filesContainerSort,
  })
);

export const getTimeplotContainerState = createSelector(
  getSelectedPath,
  getHighlightedCommitIds,
  getCommitsForTimeplot, // not filtered by start and end dates
  getTimeplotAuthorsAndCommits,
  getIsFetching,
  getStartDate,
  getEndDate,
  getRerenderRequestedAt,
  getEarliestCommitDate,
  getLatestCommitDate,
  getTotalCommits,
  (
    selectedPath,
    highlightedCommitIds,
    commits,
    authorsAndCommits,
    isFetching,
    startDate,
    endDate,
    rerenderRequestedAt,
    earliestCommitDate,
    latestCommitDate,
    totalCommits
  ) => ({
    selectedPath,
    highlightedCommitIds,
    commits,
    isFetching,
    startDate,
    endDate,
    rerenderRequestedAt,
    earliestCommitDate,
    latestCommitDate,
    totalCommits,

    authors: authorsAndCommits.length,
  })
);
