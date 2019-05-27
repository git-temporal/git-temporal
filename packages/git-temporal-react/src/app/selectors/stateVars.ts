export const getSelectedPath = state => state.selectedPath;
export const getCommits = state => state.commits;
export const getIsFetching = state => state.isFetching;
export const getDidInvalidate = state => state.getDidInvalidate;
export const getHighlightedCommitIds = state => state.highlightedCommitIds;
export const getViewCommitsOrFiles = state =>
  state.viewCommitsOrFiles || 'commits';

export const getSearch = state => state.search;
export const getStartDate = state => state.startDate;
export const getEndDate = state => state.endDate;

export const getAuthorsContainerSort = state => state.authorsContainerSort;
export const getCommitsContainerSort = state => state.commitsContainerSort;
export const getFilesContainerSort = state => state.filesContainerSort;

export const getIsFileSelected = state => state.isFileSelected;

export const getDiff = state => state.diff;
export const getIsDiffFetching = state => state.isDiffFetching;
