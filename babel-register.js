/* eslint import/no-extraneous-dependencies: 0 */ // --> OFF

path = require('path');

// Add support for generators and async functions:
require('regenerator-runtime/runtime');

require('@babel/register')();

require('ts-node').register({
  typeCheck: false,
  ignoreWarnings: true,
  disableWarnings: true,
  project: path.resolve(__dirname, 'tsconfig.json'),
});

require('tsconfig-paths');
