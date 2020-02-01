const baseConfig = require('./jest.base.config')

module.exports = Object.assign({}, baseConfig, {
  globals: {
    'ts-jest': {
      enableTsDiagnostics: false,
      tsConfigFile: './tsconfig.json',
    },
  },
  setupFiles: ['./config/jest.setup.js'],

})