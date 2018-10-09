import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import { GitTemporalProps } from './interfaces';
import GitTemporal from './GitTemporal';

const middleware = [reduxThunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(reducers, applyMiddleware(...middleware));

// @ts-ignore
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  // @ts-ignore
  module.hot.accept('./reducers', () => {
    const nextReducer = require('./reducers/index').default;
    store.replaceReducer(nextReducer);
  });
}

export default class GitTemporalIndex extends React.Component<
  GitTemporalProps
> {
  render() {
    const { path = '', serviceBaseUrl = '/git-temporal' } = this.props;
    return (
      <Provider store={store}>
        <GitTemporal path={path} serviceBaseUrl={serviceBaseUrl} />
      </Provider>
    );
  }
}
