import { receiveCommits } from 'app/actions/commits';
import { receiveDiff } from 'app/actions/diff';

// @ts-ignore
export const isVscode = window && window.IS_VSCODE_WEBVIEW;
// @ts-ignore
export const vscode = isVscode ? acquireVsCodeApi() : null;

if (isVscode) {
  console.log('git-temporal-react: running in VSCode.');
}

export function handleVscodeMessages(dispatch) {
  // @ts-ignore
  if (!window || !window.IS_VSCODE_WEBVIEW) {
    return;
  }
  window.addEventListener('message', handleMessage);

  function handleMessage(event: Event) {
    console.log('git-temporal-react: received window message');
    console.log(JSON.stringify(event, null, 2));
    // @ts-ignore
    const { type, path, data } = event.data;
    switch (type) {
      case 'commitData':
        console.log(
          `git-temporal-react: received commits ${
            data.commits.length
          } commits for ${path}`
        );
        dispatch(receiveCommits(path, data));
        break;
      case 'diffData':
        console.log(`git-temporal-react: received diff ${data}`);
        dispatch(receiveDiff(path, data));
        break;
    }
  }
}
