export const getSelectedPath = state => state.selectedPath;
export const getCommits = state => state.commits;
export const getIsFetching = state => state.isFetching;
export const getDidInvalidate = state => state.getDidInvalidate;
export const getHighlightedCommitId = state => state.highlightedCommitId;
export const getViewCommitsOrFiles = state =>
  state.viewCommitsOrFiles || 'commits';

export const getSearch = state => state.search;
export const getAuthorsContainerSort = state => state.authorsContainerSort;
export const getCommitsContainerSort = state => state.commitsContainerSort;
export const getFilesContainerSort = state => state.filesContainerSort;
