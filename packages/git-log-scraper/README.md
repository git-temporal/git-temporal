# @git-temporal/git-log-scraper

Method for parsing `git log` output

## Installation

```
  npm install @git-temporal/git-log-scraper
```

## Usage

```javascript
import { getCommitHistory } from '@git-temporal/gitLogScraper';

const commitHistory = getCommitHistory(path);
console.warn(`parsed ${commitHistory.length} commits`);
console.log(JSON.stringify(commitHistory, null, 2));
```

Returns an array of javascript objects representing the commits that effected the requested file
or directory with files and line stats, that looks like this:

```json
[{
    "id": "eeb817785c771362416fd87ea7d2a1a32dde9842",
    "authorName": "Dan",
    "relativeDate": "5 days ago",
    "authorDate": 1537317391,
    "message": "Remove some old files from stats",
    "body": "",
    "hash": "eeb817785",
    "linesAdded": 0,
    "linesDeleted": 42,
    "files": [
      {
        "name": "scripts/rollup/results.json",
        "linesAdded": 0,
        "linesDeleted": 42
      }
    ]
}, {
  ...
}]
```

### bin

git-log-scraper also provides a binary you can use

```
  npx @git-temporal/git-log-scraper . > myGitLogHistory.json
```
