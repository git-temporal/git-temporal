import { ICommit } from 'app/interfaces';
import { dateFilteredCommits } from 'app/selectors/dates';
import { ActionTypes } from 'app/actions/ActionTypes';
import { isVscode, vscode } from 'app/actions/vscode';
import { debug } from '@git-temporal/logger';
import { start } from 'repl';

const requestDiff = (path: string) => ({
  selectedPath: path,
  type: ActionTypes.REQUEST_DIFF,
});

export const receiveDiff = (path: string, diff: any) => ({
  diff,
  selectedPath: path,
  type: ActionTypes.RECEIVE_DIFF,
});

export const setDiffStartCommit = (commitId: string) => ({
  commitId,
  type: ActionTypes.SET_DIFF_START_COMMIT,
});

export const setDiffEndCommit = (commitId: string) => ({
  commitId,
  type: ActionTypes.SET_DIFF_END_COMMIT,
});

export const fetchDiff = (
  path: string,
  commits: ICommit[],
  startDate: number,
  endDate: number
) => (dispatch: any): void => {
  dispatch(requestDiff(path));
  const filteredCommits = dateFilteredCommits(commits, startDate, endDate);
  if (!filteredCommits || filteredCommits.length === 0) {
    return;
  }
  // commits are in descending order
  const rightCommit = filteredCommits[0];
  const leftCommit = filteredCommits.slice(-1)[0];

  if (isVscode) {
    debug('sending diff request to vscode ', path, leftCommit, rightCommit);
    // see actions/vscode.ts for response handling that comes as a window event
    vscode.postMessage({
      path,
      leftCommit: leftCommit.id,
      rightCommit: rightCommit.id,
      command: 'diff',
    });
  } else {
    const pathParam =
      path && path.trim().length > 0 ? `?path=${path}` : '?path=.';
    const leftCommitParam = leftCommit ? `&leftCommit=${leftCommit.id}` : '';
    const rightCommitParam = rightCommit
      ? `&rightCommit=${rightCommit.id}`
      : '';

    // TODO : replace this with serviceBaseUrl when it is in
    const url = `http://localhost:11966/git-temporal/diff${pathParam}${leftCommitParam}${rightCommitParam}`;
    fetch(url)
      .then(response => response.json())
      .then(diff => dispatch(receiveDiff(path, diff)));
  }
};
