import { ActionTypes } from 'app/actions/ActionTypes';

export const diff = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_DIFF:
      return action.diff;
    default:
      return state;
  }
};

export const isDiffDeferred = (state = false, action: any) => {
  switch (action.type) {
    // we don't fetch the diff until after the first RECEIVE_COMMITS
    // but we are going to and an looks more responsive to throw up the
    // spinner on the DifferenceViewer container sdfaf
    case ActionTypes.REQUEST_COMMITS:
    case ActionTypes.REQUEST_DIFF:
    case ActionTypes.RECEIVE_DIFF:
      return false;
    case ActionTypes.REQUEST_DEFERRED_DIFF:
      return true;
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

export const diffLeftCommit = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return null;
    case ActionTypes.REQUEST_DIFF:
      return action.leftCommit || null;
    default:
      return state;
  }
};

export const diffRightCommit = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return null;
    case ActionTypes.REQUEST_DIFF:
      return action.rightCommit || null;
    default:
      return state;
  }
};
