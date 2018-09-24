<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [@git-temporal/api-node-express](#git-temporalapi-node-express)
  - [Usage](#usage)
    - [bin](#bin)
    - [Locally installed](#locally-installed)
    - [More Runtime Options](#more-runtime-options)
  - [API](#api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @git-temporal/api-node-express

REST API for fetching git log history

## Usage

### bin

api-node-express provides a binary you can use via `npx` without need to install locally

```bash
  npx @git-temporal/api-node-express
  open http://localhost:11966/git-temporal/history
```

...that will start a server on port 11966 using the git repository associated with the current directory.

### Locally installed

```bash
npm install --save @git-temporal/api-node-express
node node_modules/.bin/api-node-express.js
open http://localhost:11966/git-temporal/history
```

### More Runtime Options

```
  npx @git-temporal/api-node-express --help
```

## API

method: GET
URI: /git-temporal/history
Params:

- path: string // path relative to repository root to return data for. default: repo root.

Returns: JSON ex:

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
