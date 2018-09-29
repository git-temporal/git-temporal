export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';
export const SELECT_PATH = 'SELECT_PATH';
export const INVALIDATE_PATH = 'INVALIDATE_PATH';

export const selectPath = path => ({
  path,
  type: SELECT_PATH,
});

export const invalidatePath = path => ({
  path,
  type: INVALIDATE_PATH,
});

export const requestCommits = path => ({
  path,
  type: REQUEST_COMMITS,
});

export const receiveCommits = (path, json) => ({
  path,
  type: RECEIVE_COMMITS,
  commits: json,
  receivedAt: Date.now(),
});

const fetchCommits = path => dispatch => {
  dispatch(requestCommits(path));
  // TODO : replace this with serviceBaseUrl when it is in the path
  return fetch(`http://localhost:11966/git-temporal/history`)
    .then(response => response.json())
    .then(json => dispatch(receiveCommits(path, json)));
};

const shouldFetchCommits = (state, path) => {
  const commits = state.commitsByPath[path];
  if (!commits) {
    return true;
  }
  if (commits.isFetching) {
    return false;
  }
  return commits.didInvalidate;
};

export const fetchCommitsIfNeeded = path => (dispatch, getState) => {
  if (shouldFetchCommits(getState(), path)) {
    return dispatch(fetchCommits(path));
  }
};
