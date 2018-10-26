import { combineReducers } from 'redux';
import {
  ActionTypes,
  AuthorsContainerFilters,
  AuthorsContainerSorts,
} from 'app/actions/ActionTypes';

// these little actions are more trouble to test and end up being brittle
// ignoring coverage on the smallest

export const selectedPath = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.SELECT_PATH:
    case ActionTypes.REQUEST_COMMITS:
    case ActionTypes.RECEIVE_COMMITS:
      return action.selectedPath;
    default:
      return state;
  }
};

export const highlightedCommitId = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.HIGHLIGHT_COMMIT:
      return action.commitId;
    default:
      return state;
  }
};

export const viewCommitsOrFiles = (state = 'commits', action) => {
  switch (action.type) {
    case ActionTypes.VIEW_COMMITS:
      return 'commits';
    case ActionTypes.VIEW_FILES:
      return 'files';
    default:
      return state;
  }
};

export const commits = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.INVALIDATE_PATH:
      return [];
    case ActionTypes.REQUEST_COMMITS:
      return [];
    case ActionTypes.RECEIVE_COMMITS:
      return action.commits;
    default:
      return state;
  }
};
export const isFetching = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return true;
    case ActionTypes.RECEIVE_COMMITS:
      return false;
    default:
      return state;
  }
};

export const didInvalidate = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.INVALIDATE_PATH:
      return true;
    case ActionTypes.REQUEST_COMMITS:
      return false;
    default:
      return state;
  }
};

export const authorsContainerFilter = (
  state = AuthorsContainerFilters.ALL,
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS_CONTAINER_FILTER:
      return action.filter;
  }
  return state;
};

export const authorsContainerSort = (
  state = AuthorsContainerSorts.TIME,
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const authorsContainerSearch = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS_CONTAINER_SEARCH:
      return action.search;
  }
  return state;
};

export const filteredAuthors = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return []; // clear filtered Authors on selected path change
    case ActionTypes.ADD_AUTHOR_FILTER:
      if (state.indexOf(action.authorName) === -1) {
        const newState = state.slice(0);
        newState.push(action.authorName);
        return newState;
      }
      break;
    case ActionTypes.REMOVE_AUTHOR_FILTER:
      const indexOf = state.indexOf(action.authorName);
      if (indexOf >= 0) {
        return state.slice(0, indexOf).concat(state.slice(indexOf + 1));
      }
      break;
    case ActionTypes.REMOVE_ALL_AUTHOR_FILTERS:
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
  authorsContainerFilter,
  authorsContainerSort,
  authorsContainerSearch,
});

export default rootReducer;
