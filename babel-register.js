/* eslint import/no-extraneous-dependencies: 0 */ // --> OFF
/* eslint no-console: 0 */ // --> OFF

const path = require('path');

// Add support for generators and async functions:
require('regenerator-runtime/runtime');

require('@babel/register')();

const tsConfigPath = path.resolve('.', 'tsconfig.json');
// console.log(`using tsConfig at ${tsConfigPath}`);
require('ts-node').register({
  typeCheck: false,
  ignoreWarnings: true,
  disableWarnings: true,
  project: tsConfigPath,
});

require('tsconfig-paths');
