const baseConfig = require('../../jest.config')

module.exports = Object.assign({}, baseConfig, {
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    'monaco-editor': '<rootDir>/src/testHelpers/mocks/monacoEditor.ts'
  },
  setupFiles: [
    ...baseConfig.setupFiles,
    './config/jest.setup.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer']
});