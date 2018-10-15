import reduxMockStore from 'redux-mock-store';
import reduxThunk from 'redux-thunk';

const middlewares = [reduxThunk]; // add your middlewares like `redux-thunk`

const defaultInitialState = {
  commits: [],
  selectedPath: '',
};

export function mockReduxStore() {
  return reduxMockStore(middlewares)(defaultInitialState);
}
