// @ts-ignore
import express from 'express';
import morgan from 'morgan';

import { findGitRoot } from '@git-temporal/commons';

import { serveHistory, serveCommitRange } from './history';
import { serveDiff } from './diff';
import { debug, log } from 'common/logger';

const app = express();
const port = process.env.GT_API_PORT || 11966;
const gitRepoPath = process.env.GT_GIT_REPO_PATH || process.cwd();

const gitRoot = findGitRoot(gitRepoPath);
debug('git root dir: ', gitRoot);
process.chdir(gitRoot);

app.use(standardHeaders);
app.use(morgan('combined'));

app.get('/git-temporal/history', serveHistory);
app.get('/git-temporal/diff', serveDiff);
app.get('/git-temporal/commitRange', serveCommitRange);

app.listen(port, () => log(`API server listening on port ${port}!`));

function standardHeaders(_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
}
