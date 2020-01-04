import { receiveCommits, receiveCommitRange } from 'app/actions/commits';
import { receiveDiff } from 'app/actions/diff';
import { debug } from 'app/utilities/logger';

// @ts-ignore
export const isVscode = window && window.IS_VSCODE_WEBVIEW;
// @ts-ignore
export const vscode = isVscode ? acquireVsCodeApi() : null;

if (isVscode) {
  debug('running in VSCode.');
}

export function handleVscodeMessages(dispatch) {
  // @ts-ignore
  if (!window || !window.IS_VSCODE_WEBVIEW) {
    return;
  }
  window.addEventListener('message', event => {
    const { data } = event;
    debug(`actions/vscode received window message`, {
      ...data,
      // don't dump full commits or file contents to log
      commits: data.commits ? `object[${data.commits.length}]` : undefined,
      leftFileContents: redactArray(data.leftFileContents),
      rightFileContents: redactArray(data.rightFileContents),
      modifiedFiles: redactArray(data.modifiedFiles),
    });

    switch (data.type) {
      case 'commitRange':
        dispatch(receiveCommitRange(data.path, data));
        break;
      case 'history':
        dispatch(receiveCommits(data.path, data));
        break;
      case 'diff':
        dispatch(receiveDiff(data.path, data));
        break;
    }
  });
}

function redactArray(array) {
  return array ? `[..] length=${array.length}` : undefined;
}
