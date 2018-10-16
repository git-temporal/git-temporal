import { combineReducers } from 'redux';
import {
  SELECT_PATH,
  INVALIDATE_PATH,
  REQUEST_COMMITS,
  RECEIVE_COMMITS,
  HIGHLIGHT_COMMIT,
  VIEW_COMMITS,
  VIEW_FILES,
  ADD_AUTHOR_FILTER,
  REMOVE_AUTHOR_FILTER,
  REMOVE_ALL_AUTHOR_FILTERS,
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

export const filteredAuthors = (state = [], action) => {
  switch (action.type) {
    case REQUEST_COMMITS:
      return []; // clear filtered Authors on selected path change
    case ADD_AUTHOR_FILTER:
      if (state.indexOf(action.authorName) === -1) {
        const newState = state.slice(0);
        newState.push(action.authorName);
        return newState;
      }
      return state;
    case REMOVE_AUTHOR_FILTER:
      const indexOf = state.indexOf(action.authorName);
      if (indexOf >= 0) {
        return state.slice(0, indexOf).concat(state.slice(indexOf + 1));
      }
    case REMOVE_ALL_AUTHOR_FILTERS:
      return [];
  }
  return state;
};

const rootReducer = combineReducers({
  commits,
  selectedPath,
  isFetching,
  didInvalidate,
  highlightedCommitId,
  viewCommitsOrFiles,
  filteredAuthors,
});

export default rootReducer;
