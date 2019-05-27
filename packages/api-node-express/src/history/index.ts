import { getCommitHistory } from '@git-temporal/git-log-scraper';
import { timeThis } from '../common/timeThis';

export function serveHistory(req, res) {
  const requestPath = req.query.path || '.';
  console.log('getting git log for path: ', requestPath, req.params, req.query);
  const { time, result } = timeThis(getCommitHistory, requestPath);
  console.log(
    `retrieved ${result.commits.length} commits for ${
      req.query.path
    } in ${time}ms`
  );
  res.send(result);
}
