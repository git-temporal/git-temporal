module.exports = {
  linters: {
    // can't use the npm commands for lint and prettier because lint-staged wants to
    // pass the name of a single file and those npm scripts have globs associated with them
    '*.{js,jsx}': ['eslint --fix', 'prettier --write', 'git add'],
    '*.{ts,tsx}': ['tslint --fix', 'prettier --write', 'git add'],
    '*.json': ['prettier --write', 'git add'],
    '*.md': ['npm run doctoc', 'prettier --write', 'git add'],
  },
  ignore: ['pull_request_template.md'],
};
