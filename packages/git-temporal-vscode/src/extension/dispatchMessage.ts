import * as vscode from 'vscode';
import { debug } from '../utilities/logger';
import {
  getCommitHistory,
  getCommitRange,
} from '@git-temporal/git-log-scraper';
import { getDiff } from '@git-temporal/git-diff-scraper';

export function dispatchMessage(message) {
  debug('got message', message);
  switch (message.command) {
    case 'alert':
      vscode.window.showErrorMessage(message.text);
      return null;
    case 'commitRange':
      return dispatchCommitRange(message);
    case 'history':
      return dispatchHistory(message);
    case 'diff':
      return dispatchDiff(message);
  }
  throw new Error(
    `Unrecognized command received from git-temporal webview (${JSON.stringify(
      message
    )})`
  );
}

function dispatchCommitRange({ path }) {
  const commitRange = getCommitRange(path);
  return {
    ...commitRange,
    path,
    type: 'commitRange',
  };
}

function dispatchHistory({ path, skip, maxCount }) {
  const commitHistory = getCommitHistory(path, { skip, maxCount });
  return {
    ...commitHistory,
    type: 'history',
  };
}

function dispatchDiff({ path, leftCommit, rightCommit }) {
  const diff = getDiff(path, leftCommit, rightCommit);
  return {
    ...diff,
    path,
    type: 'diff',
  };
}
