// @ts-ignore
window.IS_VSCODE_WEBVIEW = true;
console.log('git-temporal-vscode: set IS_VSCODE_WEBVIEW');

import * as React from 'react';
import reactDom from 'react-dom';

// tslint:disable-next-line
import GitTemporalReact from '@git-temporal/git-temporal-react';

const element: HTMLElement = document.getElementById('gitTemporal');
const currentPath = element.getAttribute('data-current-path');
console.log('git-temporal: showing for ', currentPath);
// @ts-ignore
reactDom.render(<GitTemporalReact path={currentPath} />, element);
