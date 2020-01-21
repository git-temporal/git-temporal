import React from 'react';
import { render } from '@testing-library/react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import reducers from '../app/reducers';
import { ReduxStoreMock } from './mocks/reduxStore';

const middleware = [reduxThunk]; // add your middlewares like `redux-thunk`

export function mockReduxStore(initialStore = {}) {
  return createStore(
    reducers,
    // @ts-ignore
    { ...ReduxStoreMock, ...initialStore },
    compose(applyMiddleware(...middleware))
  );
}

export function mountConnected(children, initialStore = {}) {
  const store = mockReduxStore(initialStore);
  jest.spyOn(store, 'dispatch');

  const wrapper = render(<Provider store={store}>{children}</Provider>);
  return { store, wrapper };
}
