/* eslint-disable */
var react = require('react');
var reactDom = require('react-dom');
import { safelyParseInt } from '@git-temporal/commons/lib/safelyParseInt';

const element = document.getElementById('gitTemporal');
const currentPath = element.getAttribute('data-current-path');
const initialLineNumber = safelyParseInt(
  element.getAttribute('data-initial-line-number')
);

window.IS_VSCODE_WEBVIEW = 1;
window.GTDEBUG = 1;

var GTR = require('app/Index');

console.log(
  `Attempting to render,
  ${currentPath},
  ${initialLineNumber},
  ${window.GTDEBUG},
  ${window.IS_VSCODE_WEBVIEW},

  ${element.outerHTML}`
);

reactDom.render(
  react.createElement(GTR.default, { initialLineNumber, path: currentPath }),
  element
);
