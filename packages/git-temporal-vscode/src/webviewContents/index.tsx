import * as React from 'react';
import reactDom from 'react-dom';
import { debug, setPrefix } from '@git-temporal/logger';

setPrefix('git-temporal-vscode-webview');

// @ts-ignore
window.IS_VSCODE_WEBVIEW = true;
debug('set IS_VSCODE_WEBVIEW');

// tslint:disable-next-line
import GitTemporalReact from '@git-temporal/git-temporal-react';

const element: HTMLElement = document.getElementById('gitTemporal');
const currentPath = element.getAttribute('data-current-path');
debug('rendering for ', currentPath);
// @ts-ignore
reactDom.render(<GitTemporalReact path={currentPath} />, element);
