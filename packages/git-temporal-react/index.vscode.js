/* eslint-disable */
var react = require('react');
var reactDom = require('react-dom');
var GTR = require('app/index');

const element = document.getElementById('gitTemporal');
const currentPath = element.getAttribute('data-current-path');

window.IS_VSCODE_WEBVIEW = 1;
window.GTDEBUG = 1;

console.log(
  `Attempting to render,
  ${currentPath},
  ${window.GTDEBUG},
  ${window.IS_VSCODE_WEBVIEW}`
);

reactDom.render(
  react.createElement(GTR.default, { path: currentPath }),
  element
);
