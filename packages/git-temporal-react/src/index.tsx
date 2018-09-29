import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Index from './app/Index';

ReactDOM.render(<Index />, document.getElementById('root'));

registerServiceWorker();
