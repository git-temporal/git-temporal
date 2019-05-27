import { receiveCommits } from 'app/actions';

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
          `git-temporal-react: received ${
            data.commits.length
          } commits for ${path}`
        );
        dispatch(receiveCommits(path, data));
    }
  }
}
