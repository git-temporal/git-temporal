import { getCommitHistory } from '@git-temporal/git-log-scraper';
import { timeThis } from '../common/timeThis';
import { log } from '@git-temporal/logger';

export function serveHistory(req, res) {
  const requestPath = req.query.path || '.';
  log('getting git log for path: ', requestPath, req.params, req.query);
  const { time, result } = timeThis(getCommitHistory, requestPath);
  log(
    `retrieved ${result.commits.length} commits for ${
      req.query.path
    } in ${time}ms`
  );
  res.send(result);
}
