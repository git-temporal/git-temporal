module.exports = {
  collectCoverageFrom: ['src/app/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*(test|spec)\\.(tsx|ts|js|jsx)?$',
    // this one is a beast to test shallow because it requires a full redux store
    'app/Index.tsx',
  ],

  moduleFileExtensions: ['ts', 'js', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],

  moduleNameMapper: {
    'app/(.*)$': '<rootDir>/src/app/$1',
  },

  setupFiles: ['./config/jest.setup.js', './config/polyfills.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],

  testRegex: 'src/.*(test|spec)\\.(tsx|ts|js|jsx)$',
  testURL: 'http://localhost',

  transform: {
    '\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
  ],

  verbose: true,

  globals: {
    'ts-jest': {
      enableTsDiagnostics: false,
      tsConfigFile: '../../tsconfig.json',
    },
  },
};

//  CRA generated jest config moved from package.json
//
// "jest": {
//   "collectCoverageFrom": [
//     "src/app/**/*.{js,jsx,ts,tsx}"
//   ],
//     "setupFiles": [
//       "<rootDir>/config/polyfills.js"
//     ],
//       "testMatch": [
//         "<rootDir>/src/app/**/__tests__/**/*.(j|t)s?(x)",
//         "<rootDir>/src/app/**/?(*.)(spec|test).(j|t)s?(x)"
//       ],
//         "testEnvironment": "node",
//           "testURL": "http://localhost",
//             "transform": {
//     "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
//       "^.+\\.tsx?$": "<rootDir>/config/jest/typescriptTransform.js",
//         "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
//           "^(?!.*\\.(js|jsx|mjs|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
//   },
//   "transformIgnorePatterns": [
//     "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$"
//   ],
//     "moduleNameMapper": {
//     "^react-native$": "react-native-web"
//   },
//   "moduleFileExtensions": [
//     "web.ts",
//     "ts",
//     "web.tsx",
//     "tsx",
//     "web.js",
//     "js",
//     "web.jsx",
//     "jsx",
//     "json",
//     "node",
//     "mjs"
//   ],
//     "globals": {
//     "ts-jest": {
//       "tsConfigFile": "../../tsconfig.json"
//     }
//   }
// }
