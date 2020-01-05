export const getSelectedPath = state => state.selectedPath;
export const getCommits = state => state.commits;
export const getIsFetching = state => state.isFetching;
export const getEarliestCommitDate = state => state.earliestCommitDate;
export const getLatestCommitDate = state => state.latestCommitDate;
export const getTotalCommits = state => state.totalCommits;

export const getRerenderRequestedAt = state => state.rerenderRequestedAt;

export const getHighlightedCommitIds = state => state.highlightedCommitIds;

export const getSearch = state => state.search;
export const getStartDate = state => state.startDate;
export const getEndDate = state => state.endDate;

export const getAuthorsContainerSort = state => state.authorsContainerSort;
export const getCommitsContainerSort = state => state.commitsContainerSort;
export const getFilesContainerSort = state => state.filesContainerSort;

export const getIsFileSelected = state => state.isFileSelected;

export const getOpenSidePanelGroup = state => state.openSidePanelGroup;

export const getDiff = state => state.diff;
export const getIsDiffFetching = state => state.isDiffFetching;
export const getIsDiffDeferred = state => state.isDiffDeferred;
export const getDiffLeftCommit = state => state.diffLeftCommit;
export const getDiffRightCommit = state => state.diffRightCommit;
