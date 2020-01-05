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

const requestDeferredDiff = (path: string) => ({
  selectedPath: path,
  type: ActionTypes.REQUEST_DEFERRED_DIFF,
});

const _receiveDiff = (path: string, diff: any) => ({
  diff,
  selectedPath: path,
  type: ActionTypes.RECEIVE_DIFF,
});

export const receiveDiff = (path: string, diff: any) => (
  dispatch: any,
  getState: any
) => {
  // We fetch the diff initially with left and right commit
  // of null which returns the diff of uncommited changes.
  // If there are are no uncommited changes, show the changes
  // made by the last commit.
  const { diffLeftCommit, diffRightCommit, isFetching, commits } = getState();
  const areDefaults = !diffLeftCommit && !diffRightCommit;
  const isUnchangedFile =
    !diff.isDirectory &&
    ((!diff.leftFileContents && !diff.rightFileContents) ||
      diff.leftFileContents === diff.rightFileContents);
  const isUnchangedDirectory =
    diff.isDirectory &&
    (!diff.modifiedFiles || diff.modifiedFiles.length === 0);
  const areCommits = commits && commits.length > 1;
  if (areDefaults && (isUnchangedFile || isUnchangedDirectory)) {
    if (commits && commits.length > 1) {
      dispatch(fetchDiff(path, commits[1], commits[0]));
    } else if (isFetching) {
      // this will cause the next receive commits to call a fetchDiff
      // with the two most recent commits
      dispatch(requestDeferredDiff(path));
    } else {
      dispatch(_receiveDiff(path, diff));
    }
  } else {
    dispatch(_receiveDiff(path, diff));
  }
};

export const fetchDiff = (
  path: string,
  leftCommit?: ICommit,
  rightCommit?: ICommit
) => (dispatch: any, getState: any): void => {
  // set state vars first for isDiffFetching
  dispatch(requestDiff(path, leftCommit, rightCommit));

  if (isVscode) {
    debug('sending diff request to vscode ', path, leftCommit, rightCommit);
    // see actions/vscode.ts for response handling that comes as a window event
    vscode.postMessage({
      path,
      leftCommit: (leftCommit && leftCommit.id) || null,
      rightCommit: (rightCommit && rightCommit.id) || null,
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
