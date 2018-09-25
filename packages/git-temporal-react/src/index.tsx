import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import GitTemporal from './app/GitTemporal';

ReactDOM.render(<GitTemporal />, document.getElementById(
  'root'
) as HTMLElement);

registerServiceWorker();
