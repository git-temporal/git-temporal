export const getSelectedPath = state => state.selectedPath;
export const getCommits = state => state.commits;
export const getIsFetching = state => state.isFetching;

export const getRerenderRequestedAt = state => state.rerenderRequestedAt;

export const getHighlightedCommitIds = state => state.highlightedCommitIds;

export const getSearch = state => state.search;
export const getStartDate = state => state.startDate;
export const getEndDate = state => state.endDate;

export const getAuthorsContainerSort = state => state.authorsContainerSort;
export const getCommitsContainerSort = state => state.commitsContainerSort;
export const getFilesContainerSort = state => state.filesContainerSort;

export const getIsFileSelected = state => state.isFileSelected;

export const getDiff = state => state.diff;
export const getIsDiffFetching = state => state.isDiffFetching;
export const getDiffStartCommit = state => state.diffStartCommitId;
export const getDiffEndCommit = state => state.diffEndCommitId;
