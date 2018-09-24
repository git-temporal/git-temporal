import path from 'path';
import express from 'express';
import { getCommitHistory } from '@git-temporal/git-log-scraper';

const app = express();
const port = 11966;

// @ts-ignore
app.get('/git-temporal/history', (req, res) => {
  res.send(getCommitHistory(path.resolve(__dirname, '../../../')));
});

app.listen(port, () =>
  console.log(`git-temporal API server listening on port ${port}!`)
);
