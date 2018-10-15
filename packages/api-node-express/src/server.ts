// @ts-ignore
import express from 'express';
import { getCommitHistory } from '@git-temporal/git-log-scraper';

import findGitRoot from './common/findGitRoot';

const app = express();
const port = process.env.GT_API_PORT || 11966;
const gitRepoPath = process.env.GT_GIT_REPO_PATH || process.cwd();

const gitRoot = findGitRoot(gitRepoPath);
console.log('git root dir: ', gitRoot);
process.chdir(gitRoot);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/git-temporal/history', (req, res) => {
  const requestPath = req.query.path || '.';
  console.log('getting git log for path: ', requestPath, req.params, req.query);
  const timeStart = Date.now();
  const commits = getCommitHistory(requestPath);
  console.log(
    `retrieved ${commits.length} commits for ${req.query.path} in ${Date.now() -
      timeStart}ms`
  );
  res.send({
    commits,
    path: req.query.path,
  });
});

app.listen(port, () =>
  console.log(`git-temporal API server listening on port ${port}!`)
);
