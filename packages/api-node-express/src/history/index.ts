import * as fs from 'fs';
import * as path from 'path';

import { getCommitHistory } from '@git-temporal/git-log-scraper';
import { timeThis } from '../common/timeThis';

export function serveHistory(req, res) {
  const requestPath = req.query.path || '.';
  console.log('getting git log for path: ', requestPath, req.params, req.query);
  const { time, result: commits } = timeThis(getCommitHistory, requestPath);
  console.log(
    `retrieved ${commits.length} commits for ${req.query.path} in ${time}ms`
  );

  const resolvedPath = path.resolve('.', requestPath);
  const isFile =
    fs.existsSync(resolvedPath) && !fs.lstatSync(resolvedPath).isDirectory();
  res.send({
    isFile,
    path: req.query.path,
    commits: commits.sort((a, b) => {
      return b.authorDate - a.authorDate;
    }),
  });
}
