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

export const selectedPath = (state = '', action) => {
  switch (action.type) {
    case SELECT_PATH:
    case REQUEST_COMMITS:
    case RECEIVE_COMMITS:
      return action.selectedPath;
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

export const commits = (state = [], action) => {
  switch (action.type) {
    case INVALIDATE_PATH:
      return [];
    case REQUEST_COMMITS:
      return [];
    case RECEIVE_COMMITS:
      return action.commits;
    default:
      return state;
  }
};
export const isFetching = (state = false, action) => {
  switch (action.type) {
    case REQUEST_COMMITS:
      return true;
    case RECEIVE_COMMITS:
      return false;
    default:
      return state;
  }
};

export const didInvalidate = (state = false, action) => {
  switch (action.type) {
    case INVALIDATE_PATH:
      return true;
    case REQUEST_COMMITS:
      return false;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  commits,
  selectedPath,
  isFetching,
  didInvalidate,
  highlightedCommitId,
  viewCommitsOrFiles,
});

export default rootReducer;
