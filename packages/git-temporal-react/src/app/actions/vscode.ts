import { receiveCommits } from 'app/actions/commits';
import { receiveDiff } from 'app/actions/diff';
import { debug } from '@git-temporal/logger';

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
  window.addEventListener('message', handleMessage);

  function handleMessage(event: Event) {
    debug('received window message');
    debug(JSON.stringify(event, null, 2));
    // @ts-ignore
    const { type, path, data } = event.data;
    switch (type) {
      case 'commitData':
        debug(`received commits ${data.commits.length} commits for ${path}`);
        dispatch(receiveCommits(path, data));
        break;
      case 'diffData':
        debug(`received diff ${data}`);
        dispatch(receiveDiff(path, data));
        break;
    }
  }
}
