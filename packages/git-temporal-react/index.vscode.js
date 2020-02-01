/* eslint-disable */
var react = require('react');
var reactDom = require('react-dom');

const element = document.getElementById('gitTemporal');
const currentPath = element.getAttribute('data-current-path');

window.IS_VSCODE_WEBVIEW = 1;
window.GTDEBUG = 1;

var GTR = require('./src/app/index.tsx');

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
