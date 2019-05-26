import {
  ActionTypes,
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
} from './ActionTypes';

// @ts-ignore
if (window && window.IS_VSCODE_WEBVIEW) {
  console.log('git-temporal-react: running in VSCode!');
}
export const selectPath = path => (dispatch, _getState) => {
  // if this comes from a rename, follow the most current name
  const actualPath = path.replace(/\{(.*)\s=>\s(.*)\}/g, '$2');

  dispatch(fetchCommitsIfNeeded(actualPath));
  return { selectedPath: actualPath, type: ActionTypes.SELECT_PATH };
};

export const invalidatePath = path => ({
  selectedPath: path,
  type: ActionTypes.INVALIDATE_PATH,
});

export const setAuthorsContainerSort = (sort: AuthorsContainerSorts) => ({
  sort,
  type: ActionTypes.SET_AUTHORS_CONTAINER_SORT,
});

export const setSearch = (search: string) => ({
  search,
  type: ActionTypes.SET_SEARCH,
});

export const setStartDate = (startDate: number) => ({
  startDate,
  type: ActionTypes.SET_START_DATE,
});

export const setEndDate = (endDate: number) => ({
  endDate,
  type: ActionTypes.SET_END_DATE,
});

export const setCommitsContainerSort = (sort: CommitsContainerSorts) => ({
  sort,
  type: ActionTypes.SET_COMMITS_CONTAINER_SORT,
});

export const setFilesContainerSort = (sort: FilesContainerSorts) => ({
  sort,
  type: ActionTypes.SET_FILES_CONTAINER_SORT,
});

export const highlightCommits = commitIds => ({
  commitIds,
  type: ActionTypes.HIGHLIGHT_COMMITS,
});

export const viewCommits = () => ({
  type: ActionTypes.VIEW_COMMITS,
});

export const viewFiles = () => ({
  type: ActionTypes.VIEW_FILES,
});

export const requestCommits = path => ({
  selectedPath: path,
  type: ActionTypes.REQUEST_COMMITS,
});

export const receiveCommits = (path, json) => ({
  selectedPath: path,
  commits: json.commits,
  isFileSelected: json.isFile,
  type: ActionTypes.RECEIVE_COMMITS,
});

const fetchCommits = path => dispatch => {
  dispatch(requestCommits(path));
  const pathParam = path && path.trim().length > 0 ? `?path=${path}` : '';
  // TODO : replace this with serviceBaseUrl when it is in
  return fetch(`http://localhost:11966/git-temporal/history${pathParam}`)
    .then(response => response.json())
    .then(json => dispatch(receiveCommits(path, json)));
};

const shouldFetchCommits = (state, path) => {
  if (state.isFetching) {
    return false;
  }
  return (
    state.didInvalidate ||
    !state.commits ||
    state.commits.length <= 0 ||
    state.selectedPath !== path
  );
};

export const fetchCommitsIfNeeded = path => (dispatch, getState) => {
  if (shouldFetchCommits(getState(), path)) {
    return dispatch(fetchCommits(path));
  }
};
