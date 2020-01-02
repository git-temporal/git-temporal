const baseConfig = require('../../.babelrc.js');

baseConfig.plugins.push([
  'module-resolver',
  {
    root: ['./src'],
  },
  'babel-plugin-dynamic-import-node',
]);
module.exports = baseConfig;
