<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [@git-temporal/api-node-express](#git-temporalapi-node-express)
  - [Usage](#usage)
    - [bin](#bin)
    - [Locally installed](#locally-installed)
    - [More Runtime Options](#more-runtime-options)
  - [API](#api)
    - [URI: /git-temporal/history](#uri-git-temporalhistory)
      - [method: GET](#method-get)
      - [Parameters](#parameters)
      - [Returns](#returns)
      - [Example](#example)
    - [URI: /git-temporal/diff](#uri-git-temporaldiff)
      - [Method: GET](#method-get)
      - [Parameters](#parameters-1)
      - [Returns](#returns-1)
      - [_Example response to request for directory_](#_example-response-to-request-for-directory_)
      - [_Example response to request for file_](#_example-response-to-request-for-file_)

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

### URI: /git-temporal/history

#### method: GET

#### Parameters

| param | type   | default   | description                      |
| ----- | ------ | --------- | -------------------------------- |
| path  | string | repo root | path relative to repository root |

#### Returns

This API returns a JSON object.

#### Example

```json
{
  "path": "the/path/requested",
  "commits": [{
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
}
```

### URI: /git-temporal/diff

#### Method: GET

#### Parameters

| param       | type   | default       | description                                         |
| ----------- | ------ | ------------- | --------------------------------------------------- |
| path        | string | repo root     | path relative to repository root                    |
| leftCommit  | string | HEAD rev      | commit ID hash for the `leftFileContents` returned  |
| rightCommit | string | local changes | commit ID hash for the `rightFileContents` returned |

#### Returns

This API returns a JSON object.

When a directory is requested, the `leftFileContents` and `rightFileContents` members will be null.

When a file is requested, the `leftFileContents` and `rightFileContents` members will contain the
base64 encoded contents of the file at time of `leftCommit` and `rightCommit` respectively.

#### _Example response to request for directory_

```json
{
  "path": "the/path/requested",
  "isDirectory": true,
  "leftCommit": "235eaf93ab",
  "rightCommit": "343bc246f3d",
  "leftFileContents": null,
  "rightFileContents": null,
  "rawDiff":"IHBhY2thZ2VzL2FwaS1ub2RlLWV4cHJlc3Mvc3JjL2RpZmYvaW5kZXgu
  HMgfCA4NCArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysr
  KysrLS0tLS0tLS0tLS0tLS0tL..."
}
```

#### _Example response to request for file_

```json
{
  "path": "path/requestedFile.ext",
  "isDirectory": false,
  "leftCommit": "235eaf93ab",
  "rightCommit": "343bc246f3d",
  "leftFileContents": "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz
IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg
dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu
dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo
ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4",
  "rightFileContents": "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz
IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg
dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu
dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo
ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4",
  "rawDiff": "IHBhY2thZ2VzL2FwaS1ub2RlLWV4cHJlc3Mvc3JjL2RpZmYvaW5kZXgu
HMgfCA4NCArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysr
KysrLS0tLS0tLS0tLS0tLS0tL..."

}
```
