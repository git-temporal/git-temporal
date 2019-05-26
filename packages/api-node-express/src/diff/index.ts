import { timeThis } from '../common/timeThis';
import { getDiff } from '@git-temporal/git-diff-scraper';

export function serveDiff(req, res) {
  const requestPath = req.query.path || '.';
  const leftCommit = req.query.leftCommit || 'HEAD';
  const rightCommit = req.query.rightCommit || 'local';

  console.log(`fetching diffs`, requestPath, leftCommit, rightCommit);
  const { time, result: response } = timeThis(() => {
    return getDiff(requestPath, leftCommit, rightCommit);
  });
  console.log(`done in ${time}ms`, requestPath, leftCommit, rightCommit);
  res.send(response);
}
