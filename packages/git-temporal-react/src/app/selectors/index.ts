import { createSelector } from 'reselect';

import {
  getSelectedPath,
  getHighlightedCommitIds,
  getIsFetching,
  getCommitsContainerSort,
  getSearch,
  getAuthorsContainerSort,
  getFilesContainerSort,
  getStartDate,
  getEndDate,
  getIsFileSelected,
  getDiff,
  getIsDiffFetching,
  getRerenderRequestedAt,
} from './stateVars';

import { getAuthorsAndCommits } from './authorsAndCommits';
import { getFilteredFilesForFilesContainer } from './files';

import {
  getFilteredCommits,
  getFilteredSortedCommits,
  getCommitsForTimeplot,
} from './commits';

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

export const getCommitsContainerState = createSelector(
  getSelectedPath,
  getHighlightedCommitIds,
  getFilteredSortedCommits,
  getIsFetching,
  getIsFileSelected,
  getCommitsContainerSort,
  (
    selectedPath,
    highlightedCommitIds,
    commits,
    isFetching,
    isFileSelected,
    commitsContainerSort
  ) => ({
    selectedPath,
    highlightedCommitIds,
    commits,
    isFetching,
    isFileSelected,
    commitsContainerSort,
  })
);

export const getCommitsActionMenuState = createSelector(
  getCommitsContainerSort,
  commitsContainerSort => ({
    commitsContainerSort,
  })
);

export const getHeaderContainerState = createSelector(
  getFilteredCommits,
  getSelectedPath,
  getStartDate,
  getEndDate,

  (commits, selectedPath, startDate, endDate) => {
    // psssst - commits are in descending time order
    const defaultedStartDate =
      startDate ||
      (commits &&
        commits.length > 0 &&
        commits[commits.length - 1].authorDate) ||
      0;
    const defaultedEndDate =
      endDate ||
      (commits && commits.length > 0 && commits[0].authorDate) ||
      // @ts-ignore
      Math.floor(new Date() / 1000);

    const isDefaultDates = startDate == null && endDate == null;

    return {
      selectedPath,
      isDefaultDates,
      startDate: defaultedStartDate,
      endDate: defaultedEndDate,
    };
  }
);

export const getSearchContainerState = createSelector(getSearch, search => {
  return {
    search,
  };
});

export const getAuthorsActionMenuState = createSelector(
  getAuthorsContainerSort,
  authorsContainerSort => ({
    authorsContainerSort,
  })
);

export const getAuthorsContainerState = createSelector(
  getAuthorsAndCommits,
  getAuthorsContainerSort,
  getSearch,
  getHighlightedCommitIds,
  (authorsAndCommits, authorsContainerSort, search, highlightedCommitIds) => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let totalCommits = 0;
    let maxImpact = 0;
    let maxCommits = 0;

    const authorsArray = authorsAndCommits.map(ac => {
      totalCommits += ac.commits.length;
      totalLinesDeleted += ac.linesDeleted;
      totalLinesAdded += ac.linesAdded;
      const impact = ac.linesAdded + ac.linesDeleted;
      if (impact > maxImpact) {
        maxImpact = impact;
      }
      if (ac.commits.length > maxCommits) {
        maxCommits = ac.commits.length;
      }
      return {
        ...ac,
      };
    });

    return {
      totalLinesAdded,
      totalLinesDeleted,
      totalCommits,
      maxImpact,
      maxCommits,
      authorsContainerSort,
      search,
      highlightedCommitIds,
      authors: authorsArray,
    };
  }
);

export const getFilesActionMenuState = createSelector(
  getFilesContainerSort,
  filesContainerSort => ({
    filesContainerSort,
  })
);

export const getFilesContainerState = createSelector(
  getFilteredFilesForFilesContainer,
  getIsFileSelected,
  getFilesContainerSort,
  getSearch,
  (files, isFileSelected, filesContainerSort, search) => ({
    files,
    isFileSelected,
    filesContainerSort,
    search,
  })
);

export const getStatsContainerState = createSelector(
  getFilteredCommits,
  getIsFileSelected,
  (commits, isFileSelected) => {
    let minAuthorDate = Date.now();
    let maxAuthorDate = 0;

    for (const commit of commits) {
      if (commit.authorDate < minAuthorDate) {
        minAuthorDate = commit.authorDate;
      }
      if (commit.authorDate > maxAuthorDate) {
        maxAuthorDate = commit.authorDate;
      }
    }

    return {
      minAuthorDate,
      maxAuthorDate,
      isFileSelected,
    };
  }
);

export const getTimeplotContainerState = createSelector(
  getSelectedPath,
  getHighlightedCommitIds,
  getCommitsForTimeplot, // not filtered by start and end dates
  getAuthorsAndCommits,
  getStartDate,
  getEndDate,
  getRerenderRequestedAt,
  (
    selectedPath,
    highlightedCommitIds,
    commits,
    authorsAndCommits,
    startDate,
    endDate,
    rerenderRequestedAt
  ) => ({
    selectedPath,
    highlightedCommitIds,
    commits,
    startDate,
    endDate,
    rerenderRequestedAt,
    authors: authorsAndCommits.length,
  })
);

export const getDifferenceViewerContainerState = createSelector(
  getSelectedPath,
  getCommitsForTimeplot, // not filtered by start and end dates
  getFilteredCommits,
  getStartDate,
  getEndDate,
  getDiff,
  getIsDiffFetching,
  getRerenderRequestedAt,
  (
    selectedPath,
    commits,
    filteredCommits,
    startDate,
    endDate,
    diff,
    isDiffFetching,
    rerenderRequestedAt
  ) => ({
    selectedPath,
    commits,
    filteredCommits,
    startDate,
    endDate,
    diff,
    isDiffFetching,
    rerenderRequestedAt,
  })
);

export const getDifferenceViewerHeaderState = createSelector(
  getSelectedPath,
  getCommitsForTimeplot, // not filtered by start and end dates
  getFilteredCommits,
  getStartDate,
  getEndDate,
  (selectedPath, timeplotCommits, filteredCommits, startDate, endDate) => ({
    selectedPath,
    startDate,
    endDate,
    timeplotCommits,
    filteredCommits,
  })
);
