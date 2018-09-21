/* eslint import/no-extraneous-dependencies: 0 */ // --> OFF

// Add support for generators and async functions:
require('regenerator-runtime/runtime');

require('@babel/register')();

require('ts-node').register({
  typeCheck: false,
  ignoreWarnings: true,
  disableWarnings: true,
  project: './tsconfig.json',
});

require('tsconfig-paths');
