const baseConfig = require('../../.babelrc.js');

baseConfig.plugins.push([
  'module-resolver',
  {
    root: ['./src'],
  },
]);
module.exports = baseConfig;
