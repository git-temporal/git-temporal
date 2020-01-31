module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/src/bin/',
    '.*(test|spec)\\.(tsx|ts|js|jsx)?$',
  ],

  moduleFileExtensions: ['ts', 'js', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],

  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
  },

  setupFiles: ['./config/jest.setup.js'],
  // setupFiles: ['./config/jest.setup.js', './config/polyfills.js'],
  // snapshotSerializers: ['enzyme-to-json/serializer'],

  testPathIgnorePatterns: ['/test/repos'],
  testRegex: '.*(test|spec)\\.(tsx|ts|js|jsx)$',
  testURL: 'http://localhost',

  transform: {
    '\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
    '[/\\\\]test[/\\\\]repos[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
  ],
  verbose: true,

  globals: {
    'ts-jest': {
      enableTsDiagnostics: false,
      tsConfigFile: '../../tsconfig.json',
    },
  },
};
