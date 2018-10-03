const baseConfig = require('../../.babelrc.js');

baseConfig.presets.push('@babel/react');
baseConfig.plugins.push([
  'module-resolver',
  {
    root: ['./src'],
  },
]);
module.exports = baseConfig;
