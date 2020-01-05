<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [@git-temporal/git-log-scraper](#git-temporalgit-log-scraper)
  - [Installation](#installation)
  - [API Usage](#api-usage)
    - [Data Structures](#data-structures)
      - [ICommit](#icommit)
    - [Functions](#functions)
      - [getCommitRange](#getcommitrange)
      - [getCommitHistory](#getcommithistory)
    - [bin](#bin)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @git-temporal/git-log-scraper

Method for parsing `git log` output

## Installation

```
  npm install @git-temporal/git-log-scraper
```

## API Usage

### Data Structures

#### ICommit

```typescript
interface ICommit = {
  "id": string;
  "authorName": string;
  "relativeDate": string;
  "authorDate": number;
  "message": string;
  "body": string;
  "hash": string;
  "linesAdded": number;
  "linesDeleted": number;
  "files": [
    {
      "name": string;
      "linesAdded": 0;
      "linesDeleted": 42;
    }
  ]
}
```

### Functions

#### getCommitRange

```typescript
  getCommitRange(filePath: string) : {
    count: number;
    firstCommit: ICommit,
    lastCommit: ICommit
  }[]
```

Example:

```javascript
import { getCommitRange } from '@git-temporal/gitLogScraper';

const commitRange = getCommitHistory(path);
console.warn(`There were ${commitRange.count} commits
  from ${commitRange.firstCommit.authorDate`)
  to ${commitRange.lastCommit.authorDate`)

`);
console.log(JSON.stringify(commitRange, null, 2));
```

#### getCommitHistory

```typescript
  getCommitHistory(filePath: string, skip?: number, count?: number) : ICommit[]
```

Example:

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

...will printout nicely formatted json for the git log information in a directory.
