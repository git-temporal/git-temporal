var tslintJson = require('./tslint.json');

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'class-methods-use-this': 'warn',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'arrow-body-style': 'off',
    'import/no-unresolved': 'off',
    'no-continue': 'off',
  },
  // settings: {
  //   'import/resolver': 'node',
  // },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  globals: tslintJson.globals,
};
