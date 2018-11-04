import { createSelector } from 'reselect';

import {
  getCommits,
  getSelectedPath,
  getViewCommitsOrFiles,
  getHighlightedCommitId,
  getIsFetching,
  getDidInvalidate,
  getCommitsContainerSort,
  getSearch,
  getAuthorsContainerSort,
  getFilesContainerSort,
} from './stateVars';

import { hasSearch, matchesFileSearch, fileSearchRegex } from './search';
import { getAuthorsAndCommits } from './authorsAndCommits';
import { getIsFileSelected, getFilteredFiles } from './files';

import { getFilteredCommits } from './commits';

// The methods exported from this module are intended to provide props for redux
// containers mapStateToProps method and can be passed directly to that method

export const getCommitsActionMenuState = createSelector(
  getCommitsContainerSort,
  commitsContainerSort => ({
    commitsContainerSort,
  })
);

export const getFilteredCommitsState = createSelector(
  getSelectedPath,
  getViewCommitsOrFiles,
  getHighlightedCommitId,
  getFilteredCommits,
  getIsFileSelected,
  getIsFetching,
  getDidInvalidate,
  getCommitsContainerSort,
  getSearch,
  (
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate,
    commitsContainerSort,
    search
  ) => ({
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate,
    commitsContainerSort,
    search,
  })
);

export const getHeaderContainerState = createSelector(
  getSelectedPath,
  getSearch,
  (selectedPath, search) => ({
    selectedPath,
    search,
  })
);

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
  (authorsAndCommits, authorsContainerSort, search) => {
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
      authors: authorsArray,
    };
  }
);

const getFilteredFilesForFilesContainer = createSelector(
  getFilteredFiles,
  getSearch,
  (files, search) => {
    // if the user specifically searched for files on show those in files container
    // otherwise all files in any commits with this file would also show up here
    if (hasSearch(search) && search.match(fileSearchRegex)) {
      return files.filter(file => {
        return matchesFileSearch(file.fileName, search);
      });
    }
    return files;
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
  getFilteredFilesForFilesContainer,
  getViewCommitsOrFiles,
  getIsFileSelected,
  getAuthorsAndCommits,
  (commits, files, viewCommitsOrFiles, isFileSelected, authorsAndCommits) => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let minAuthorDate = Date.now();
    let maxAuthorDate = 0;

    for (const commit of commits) {
      totalLinesAdded += commit.linesAdded;
      totalLinesDeleted += commit.linesDeleted;
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
      viewCommitsOrFiles,
      isFileSelected,
      authors: authorsAndCommits.length,
      commits: commits.length,
      files: files.length,
      linesAdded: totalLinesAdded,
      linesDeleted: totalLinesDeleted,
    };
  }
);

export const getTimeplotContainerState = createSelector(
  getSelectedPath,
  getHighlightedCommitId,
  getCommits,
  getAuthorsAndCommits,
  (selectedPath, highlightedCommitId, commits, authorsAndCommits) => ({
    selectedPath,
    highlightedCommitId,
    commits,
    authors: authorsAndCommits.length,
  })
);
