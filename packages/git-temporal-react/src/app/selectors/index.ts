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

import { getAuthorsAndCommits } from './authors';
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
