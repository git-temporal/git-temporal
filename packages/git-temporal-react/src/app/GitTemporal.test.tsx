import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GitTemporal from './GitTemporal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GitTemporal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
