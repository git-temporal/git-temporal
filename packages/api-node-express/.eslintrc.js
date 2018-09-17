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
  },
  settings: {
    'import/resolver': 'webpack',
  },
  globals: tslintJson.globals,
};
