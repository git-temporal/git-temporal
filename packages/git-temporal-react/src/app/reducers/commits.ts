import { ActionTypes } from 'app/actions/ActionTypes';

export const selectedPath = (state = '', action: any) => {
  switch (action.type) {
    case ActionTypes.SELECT_PATH:
    case ActionTypes.REQUEST_COMMITS:
    case ActionTypes.RECEIVE_COMMITS:
      return action.selectedPath;
    default:
      return state;
  }
};

export const commits = (state = [], action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return [];
    case ActionTypes.RECEIVE_COMMITS:
      return state.concat(action.commits);
    default:
      return state;
  }
};

export const highlightedCommitIds = (state = '', action: any) => {
  switch (action.type) {
    case ActionTypes.HIGHLIGHT_COMMITS:
      return action.commitIds;
    default:
      return state;
  }
};

export const isFetching = (state = false, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return true;
    case ActionTypes.RECEIVED_All_COMMITS:
      return false;
    default:
      return state;
  }
};

export const totalCommits = (state = 0, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return 0;
    case ActionTypes.RECEIVE_COMMIT_RANGE:
      return action.commitRange.count;
    default:
      return state;
  }
};

export const earliestCommitDate = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return null;
    case ActionTypes.RECEIVE_COMMIT_RANGE:
      return action.commitRange.firstCommit.authorDate;
    default:
      return state;
  }
};

export const latestCommitDate = (state = 0, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return null;
    case ActionTypes.RECEIVE_COMMIT_RANGE:
      return action.commitRange.lastCommit.authorDate;
    default:
      return state;
  }
};

export const isFileSelected = (state = false, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_COMMITS:
      return action.isFileSelected;
  }
  return state;
};
