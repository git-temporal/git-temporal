import { ActionTypes } from 'app/actions/ActionTypes';

export const diff = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_DIFF:
      return action.diff;
    default:
      return state;
  }
};

export const isDiffFetching = (state = false, action: any) => {
  switch (action.type) {
    // we don't fetch the diff until after the first RECEIVE_COMMITS
    // but we are going to and an looks more responsive to throw up the
    // spinner on the DifferenceViewer container sdfaf
    case ActionTypes.REQUEST_COMMITS:
    case ActionTypes.REQUEST_DIFF:
      return true;
    case ActionTypes.RECEIVE_DIFF:
      return false;
    default:
      return state;
  }
};

export const diffStartCommit = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_DIFF_START_COMMIT:
      return action.commitId;
    default:
      return state;
  }
};

export const diffEndCommit = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_DIFF_END_COMMIT:
      return action.commitId;
    default:
      return state;
  }
};
