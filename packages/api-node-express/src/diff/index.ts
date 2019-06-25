import { timeThis } from '../common/timeThis';
import { getDiff } from '@git-temporal/git-diff-scraper';
import { log } from '@git-temporal/logger';

export function serveDiff(req, res) {
  console.log('what the fucking fuck');
  const requestPath = req.query.path || '.';
  const leftCommit = req.query.leftCommit || 'HEAD';
  const rightCommit = req.query.rightCommit || 'local';

  log(`fetching diffs`, requestPath, leftCommit, rightCommit);
  const { time, result: response } = timeThis(() => {
    return getDiff(requestPath, leftCommit, rightCommit);
  });
  log(`done in ${time}ms`, requestPath, leftCommit, rightCommit);
  res.send(response);
}
