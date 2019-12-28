import { ICommit } from 'app/interfaces/index';
import { Timeplot } from 'app/containers/Timeplot';
import { setDates } from 'app/actions/setDates';
import { startDate } from './../reducers/index';
import { ActionTypes } from 'app/actions/ActionTypes';
import { isVscode, vscode } from 'app/actions/vscode';
import { debug } from '@git-temporal/logger';
import { fetchDiff } from 'app/actions/diff';
import { defaultStartDate, defaultEndDate } from 'app/selectors/dates';

if (window) {
  window['GTDEBUG'] = 1;
}

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

export const receiveRawCommits = (path, json) => (dispatch, getState) => {
  debug('ReceivedRawCommits', path, dispatch, getState);
  const { startDate, endDate, commits } = getState();
  const diffStartDate = defaultStartDate(startDate, commits);
  const diffEndDate = defaultEndDate(endDate, commits);
  dispatch(fetchDiff(path, json.commits, diffStartDate, diffEndDate));
  dispatch(receiveCommits(path, json));
};

const fetchCommits = path => dispatch => {
  dispatch(requestCommits(path));
  if (isVscode) {
    debug('sending history request to vscode ', path);
    // see actions/vscode.ts for response handling that comes as a window event
    vscode.postMessage({ path, command: 'history' });
  } else {
    const pathParam = path && path.trim().length > 0 ? `?path=${path}` : '';
    // TODO : replace this with serviceBaseUrl when it is in
    fetch(`http://localhost:11966/git-temporal/history${pathParam}`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveRawCommits(path, json));
      });
  }
};

const shouldFetchCommits = (state, path) => {
  if (state.isFetching) {
    return false;
  }
  return (
    !state.commits || state.commits.length <= 0 || state.selectedPath !== path
  );
};

export const fetchCommitsIfNeeded = path => (dispatch, getState) => {
  if (shouldFetchCommits(getState(), path)) {
    return dispatch(fetchCommits(path));
  }
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
