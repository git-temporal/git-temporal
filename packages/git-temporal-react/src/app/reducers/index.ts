import { combineReducers } from 'redux';
import {
  ActionTypes,
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
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

export const search = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.SET_SEARCH:
      return action.search;
  }
  return state;
};

export const commitsContainerSort = (
  state = CommitsContainerSorts.TIME,
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_COMMITS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const filesContainerSort = (
  state = FilesContainerSorts.TIME,
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_FILES_CONTAINER_SORT:
      return action.sort;
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
  search,
  authorsContainerSort,
  commitsContainerSort,
  filesContainerSort,
});

export default rootReducer;
