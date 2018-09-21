module.exports = {
  linters: {
    '*.{js,jsx}': ['eslint --fix', 'prettier --write', 'git add'],
    '*.{ts,tsx}': ['tslint --fix', 'prettier --write', 'git add'],
    '*.json': ['prettier --write', 'git add'],
    '*.md': ['npm run doctoc', 'prettier --write', 'git add'],
  },
};
