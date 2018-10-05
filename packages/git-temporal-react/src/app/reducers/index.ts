import { combineReducers } from 'redux';
import {
  SELECT_PATH,
  INVALIDATE_PATH,
  REQUEST_COMMITS,
  RECEIVE_COMMITS,
} from '../actions';

export const path = (state = '', action) => {
  switch (action.type) {
    case SELECT_PATH:
      return action.path;
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
});

export default rootReducer;
