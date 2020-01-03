import { totalCommits } from './../reducers/commits';
import { debug } from '@git-temporal/logger';

import { ICommit } from 'app/interfaces/index';
import { setDates } from 'app/actions/setDates';
import { ActionTypes } from 'app/actions/ActionTypes';
import { isVscode, vscode } from 'app/actions/vscode';
import { fetchDiff } from 'app/actions/diff';
import { defaultStartDate, defaultEndDate } from 'app/selectors/dates';

const PAGE_SIZE = 500;

//
//  These actions fetch commits in pages until all commits are received
//
//  To do this, it
//  - fetches commitRange to get the bounds for paging
//  - fetches each page serially until all have been received
//
//  The actions below are chained and in order of calls
//
//  Note that vscode does not have synchronous comm between webview
//  and extension process, so the next step in the chain after a
//  call to _fetch() is fired when we asynchronously receive the
//  data. see src/app/actions/vscode.ts

export const fetchCommitsIfNeeded = path => (dispatch, getState) => {
  if (shouldFetchCommits(getState(), path)) {
    dispatch(requestCommits(path));
    dispatch(fetchCommits(path));
  }
};

export const requestCommits = path => ({
  selectedPath: path,
  type: ActionTypes.REQUEST_COMMITS,
});

const fetchCommits = path => async dispatch => {
  const response = await _fetch('commitRange', { path });
  if (response) {
    const commitRange = await response.json();
    dispatch(receiveCommitRange(path, commitRange));
  }
};

export const receiveCommitRange = (path, commitRange) => async dispatch => {
  // fetch the first page
  dispatch(_receiveCommitRange(path, commitRange));
  dispatch(fetchPageOfCommits(path, 0, PAGE_SIZE));
};

const _receiveCommitRange = (path, commitRange) => {
  return {
    path,
    commitRange,
    type: ActionTypes.RECEIVE_COMMIT_RANGE,
  };
};

export const fetchPageOfCommits = (path, skip, maxCount) => async dispatch => {
  const response = await _fetch('history', { path, skip, maxCount });
  if (response) {
    const commits = await response.json();
    // will serially dispatch this method until all are received
    dispatch(receiveCommits(path, commits));
  }
};

export const receiveCommits = (path, response) => (dispatch, getState) => {
  dispatch(_receiveCommits(path, response));
  debug('actions/commits receiveCommits', response.skip);
  const { skip } = response;
  if (skip === 0) {
    const { startDate, endDate, commits } = getState();
    const diffStartDate = defaultStartDate(startDate, commits);
    const diffEndDate = defaultEndDate(endDate, commits);
    dispatch(fetchDiff(path, response.commits, diffStartDate, diffEndDate));
  }

  const nextSkip = skip + PAGE_SIZE;
  const { totalCommits } = getState();
  if (nextSkip < totalCommits) {
    dispatch(fetchPageOfCommits(path, nextSkip, PAGE_SIZE));
  } else {
    dispatch(receivedAllCommits(path));
  }
};

export const _receiveCommits = (path, response) => ({
  selectedPath: path,
  commits: response.commits,
  isFileSelected: response.isFile,
  type: ActionTypes.RECEIVE_COMMITS,
});

export const receivedAllCommits = path => ({
  selectedPath: path,
  type: ActionTypes.RECEIVED_All_COMMITS,
});

const _fetch = (command, params) => {
  if (isVscode) {
    debug('sending request to vscode', command, params);
    // see actions/vscode.ts for response handling that comes as a window event
    vscode.postMessage({ ...params, command });
    return null;
  }
  // TODO : replace this with serviceBaseUrl when it is in
  const url = new URL(`http://localhost:11966/git-temporal/${command}`);
  url.search = new URLSearchParams(params).toString();
  return fetch(url.toString());
};

const shouldFetchCommits = (state, path) => {
  if (state.isFetching) {
    return false;
  }
  return (
    !state.commits || state.commits.length <= 0 || state.selectedPath !== path
  );
};

export const selectSingleCommit = (commit, timeplotCommits) => (
  dispatch: any,
  _getState: any
) => {
  const foundIndex = timeplotCommits.findIndex((c: ICommit) => {
    return c.id === commit.id;
  });
  if (foundIndex >= 0) {
    const adjacentCommit = timeplotCommits[foundIndex + 1];
    if (adjacentCommit) {
      dispatch(
        setDates(
          adjacentCommit.authorDate * 1000,
          (commit.authorDate + 1) * 1000
        )
      );
    }
  }
};
