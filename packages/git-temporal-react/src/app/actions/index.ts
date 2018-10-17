import { ActionTypes } from './ActionTypes';

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

export const addAuthorFilter = authorName => ({
  authorName,
  type: ActionTypes.ADD_AUTHOR_FILTER,
});

export const removeAuthorFilter = authorName => ({
  authorName,
  type: ActionTypes.REMOVE_AUTHOR_FILTER,
});

export const removeAllAuthorFilters = () => ({
  type: ActionTypes.REMOVE_ALL_AUTHOR_FILTERS,
});

export const highlightCommit = commitId => ({
  commitId,
  type: ActionTypes.HIGHLIGHT_COMMIT,
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
