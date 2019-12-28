module.exports = {
  '*.{js,jsx}': ['eslint --fix', 'prettier --write', 'git add'],
  '*.{ts,tsx}': ['tslint --fix', 'prettier --write', 'git add'],
  '*.json': ['prettier --write', 'git add'],
  '*.md': ['doctoc --github', 'prettier --write', 'git add'],
};
