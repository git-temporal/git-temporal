import { ICommit } from 'app/interfaces';
import { ActionTypes } from 'app/actions/ActionTypes';
import { isVscode, vscode } from 'app/actions/vscode';
import { debug } from 'app/utilities/logger';

const requestDiff = (
  path: string,
  leftCommit: ICommit,
  rightCommit: ICommit
) => ({
  leftCommit,
  rightCommit,
  selectedPath: path,
  type: ActionTypes.REQUEST_DIFF,
});

export const receiveDiff = (path: string, diff: any) => ({
  diff,
  selectedPath: path,
  type: ActionTypes.RECEIVE_DIFF,
});

export const fetchDiff = (
  path: string,
  leftCommit?: ICommit,
  rightCommit?: ICommit
) => (dispatch: any): void => {
  // set state vars first for isDiffFetching
  dispatch(requestDiff(path, leftCommit, rightCommit));

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
