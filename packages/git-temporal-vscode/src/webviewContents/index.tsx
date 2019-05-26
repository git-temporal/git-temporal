// @ts-ignore
window.IS_VSCODE_WEBVIEW = true;
console.log('git-temporal-vscode: set IS_VSCODE_WEBVIEW');

import * as React from 'react';
import reactDom from 'react-dom';
// @ts-ignore
import gitTemporalReact from '@git-temporal/git-temporal-react';

const element: HTMLElement = document.getElementById('gitTemporal');

// @ts-ignore
reactDom.render(<GitTemporalReact />, element);
