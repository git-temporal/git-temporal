import { combineReducers } from 'redux';

import * as commitReducers from './commits';
import * as diffReducers from './diff';
import * as dateReducers from './dates';
import * as uiReducers from './ui';

const rootReducer = combineReducers({
  ...commitReducers,
  ...diffReducers,
  ...dateReducers,
  ...uiReducers,
});

export default rootReducer;
