import * as path from 'path';
// @ts-ignore
import express from 'express';
import { getCommitHistory } from '@git-temporal/git-log-scraper';

import findGitRoot from './common/findGitRoot';

const app = express();
const port = process.env.GT_API_PORT || 11966;

const gitRoot = findGitRoot();
console.log('git root dir: ', gitRoot);

app.get('/git-temporal/history', (req, res) => {
  const resolvedPath = path.resolve(gitRoot, req.query.path || '.');
  console.log(
    'getting git log for path: ',
    resolvedPath,
    req.params,
    req.query
  );
  res.send(getCommitHistory(resolvedPath));
});

app.listen(port, () =>
  console.log(`git-temporal API server listening on port ${port}!`)
);
