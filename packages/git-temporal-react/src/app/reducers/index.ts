import { combineReducers } from 'redux';
import {
  ActionTypes,
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
} from 'app/actions/ActionTypes';

// these little actions are more trouble to test and end up being brittle
// ignoring coverage on the smallest

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

export const highlightedCommitIds = (state = '', action: any) => {
  switch (action.type) {
    case ActionTypes.HIGHLIGHT_COMMITS:
      return action.commitIds;
    default:
      return state;
  }
};

export const commits = (state = [], action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_COMMITS:
      return action.commits;
    default:
      return state;
  }
};
export const isFetching = (state = false, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_COMMITS:
      return true;
    case ActionTypes.RECEIVE_COMMITS:
      return false;
    default:
      return state;
  }
};

export const diff = (state = {}, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_DIFF:
      return action.diff;
    default:
      return state;
  }
};

export const isDiffFetching = (state = false, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_DIFF:
      return true;
    case ActionTypes.RECEIVE_DIFF:
      return false;
    default:
      return state;
  }
};

export const rerenderRequestedAt = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_RERENDER:
      return Date.now();
    default:
      return state;
  }
};

export const authorsContainerSort = (
  state = AuthorsContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const search = (state = '', action: any) => {
  switch (action.type) {
    case ActionTypes.SET_SEARCH:
      return action.search;
  }
  return state;
};

export const startDate = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_START_DATE:
      return action.startDate;
  }
  return state;
};

export const endDate = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_END_DATE:
      return action.endDate;
  }
  return state;
};

export const commitsContainerSort = (
  state = CommitsContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_COMMITS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const filesContainerSort = (
  state = FilesContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_FILES_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const isFileSelected = (state = false, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_COMMITS:
      return action.isFileSelected;
  }
  return state;
};

const rootReducer = combineReducers({
  commits,
  selectedPath,
  isFetching,
  rerenderRequestedAt,
  highlightedCommitIds,
  search,
  authorsContainerSort,
  commitsContainerSort,
  filesContainerSort,
  startDate,
  endDate,
  isFileSelected,
  diff,
  isDiffFetching,
});

export default rootReducer;
