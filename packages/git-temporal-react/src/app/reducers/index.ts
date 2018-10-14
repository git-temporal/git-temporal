import { combineReducers } from 'redux';
import {
  SELECT_PATH,
  INVALIDATE_PATH,
  REQUEST_COMMITS,
  RECEIVE_COMMITS,
  HIGHLIGHT_COMMIT,
  VIEW_COMMITS,
  VIEW_FILES,
} from '../actions';

export const path = (state = '', action) => {
  switch (action.type) {
    case SELECT_PATH:
      return action.path;
    default:
      return state;
  }
};

export const highlightedCommitId = (state = '', action) => {
  switch (action.type) {
    case HIGHLIGHT_COMMIT:
      return action.commitId;
    default:
      return state;
  }
};

export const viewCommitsOrFiles = (state = 'commits', action) => {
  switch (action.type) {
    case VIEW_COMMITS:
      return 'commits';
    case VIEW_FILES:
      return 'files';
    default:
      return state;
  }
};

export const commits = (
  state = {
    isFetching: false,
    didInvalidate: false,
    commits: [],
  },
  action
) => {
  switch (action.type) {
    case INVALIDATE_PATH:
      return {
        ...state,
        didInvalidate: true,
      };
    case REQUEST_COMMITS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    case RECEIVE_COMMITS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        commits: action.commits,
        lastUpdated: action.receivedAt,
      };
    default:
      return state;
  }
};

export const commitsByPath = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_PATH:
    case RECEIVE_COMMITS:
    case REQUEST_COMMITS:
      return {
        ...state,
        [action.path]: commits(state[action.path], action),
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  commitsByPath,
  path,
  highlightedCommitId,
  viewCommitsOrFiles,
});

export default rootReducer;
