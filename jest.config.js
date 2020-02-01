const baseConfig = require('./jest.base.config')

module.exports = Object.assign({}, baseConfig, {

  globals: {
    'ts-jest': {
      enableTsDiagnostics: false,
      tsConfigFile: './tsconfig.json',
    },
  },

  projects: [
      '<rootDir>/packages/git-log-scraper/jest.config.js',
      '<rootDir>/packages/git-diff-scraper/jest.config.js',
      '<rootDir>/packages/git-temporal-react/jest.config.js',
  ],

  setupFiles: ['./config/jest.setup.js'],

})