const baseConfig = require('../../.babelrc.js');

baseConfig.presets.push('@babel/react');
baseConfig.plugins.push([
  'module-resolver',
  {
    root: ['./src'],
  },
  'babel-plugin-dynamic-import-node',
]);
module.exports = baseConfig;
