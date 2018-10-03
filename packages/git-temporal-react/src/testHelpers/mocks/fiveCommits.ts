// these are the first five commits taken from the node.js test repo used by git-temporal/git-log-scraper
// see, https://raw.githubusercontent.com/git-temporal/git-temporal/master/packages/git-log-scraper/test/snapshots/node.snapshot.json

const fiveCommits = [
  {
    id: 'c698a0f01de1fa682443510920a2dafc2440d6c8',
    authorName: 'Bee Wilkerson',
    relativeDate: '2 days ago',
    authorDate: 1537541919,
    message: 'Explain why this fork exists in README.md',
    body: '',
    hash: 'c698a0f01d',
    linesAdded: 2,
    linesDeleted: 649,
    files: [
      {
        name: 'README.md',
        linesAdded: 2,
        linesDeleted: 649,
      },
    ],
  },
  {
    id: '058c5b81cdbabe8989a194ba5d388f4c230f4af6',
    authorName: 'Tobias Nießen',
    relativeDate: '2 days ago',
    authorDate: 1537272890,
    message: 'crypto: do not allow multiple calls to setAuthTag',
    body:
      'Calling setAuthTag multiple times can result in hard to detect bugssince to the user, it is unclear which invocation actually affectedOpenSSL.PR-URL: https://github.com/nodejs/node/pull/22931Reviewed-By: Anna Henningsen <anna@addaleax.net>Reviewed-By: James M Snell <jasnell@gmail.com>Reviewed-By: Ujjwal Sharma <usharma1998@gmail.com>',
    hash: '058c5b81cd',
    linesAdded: 29,
    linesDeleted: 6,
    files: [
      {
        name: 'doc/api/crypto.md',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'src/node_crypto.cc',
        linesAdded: 2,
        linesDeleted: 5,
      },
      {
        name: 'test/parallel/test-crypto-authenticated.js',
        linesAdded: 26,
        linesDeleted: 0,
      },
    ],
  },
  {
    id: '56493bf1ebfab3ec102fe017f30fa4f81ba6a256',
    authorName: 'Daniel Bevenius',
    relativeDate: '2 days ago',
    authorDate: 1526296167,
    message: 'tools: add bash completion for node',
    body:
      'This commit adds a --completion-bash option to node which can besourced to provide bash code completion for node options.Usage:$ node --completion-bash  > node_bash_completion$ source node_bash_completion$ node --[tab]PR-URL: https://github.com/nodejs/node/pull/20713Reviewed-By: Anna Henningsen <anna@addaleax.net>Reviewed-By: James M Snell <jasnell@gmail.com>Reviewed-By: Denys Otrishko <shishugi@gmail.com>',
    hash: '56493bf1eb',
    linesAdded: 51,
    linesDeleted: 1,
    files: [
      {
        name: 'doc/api/cli.md',
        linesAdded: 11,
        linesDeleted: 0,
      },
      {
        name: 'doc/node.1',
        linesAdded: 3,
        linesDeleted: 0,
      },
      {
        name: 'lib/internal/bash_completion.js',
        linesAdded: 25,
        linesDeleted: 0,
      },
      {
        name: 'lib/internal/bootstrap/node.js',
        linesAdded: 7,
        linesDeleted: 1,
      },
      {
        name: 'node.gyp',
        linesAdded: 1,
        linesDeleted: 0,
      },
      {
        name: 'src/node_options.cc',
        linesAdded: 3,
        linesDeleted: 0,
      },
      {
        name: 'src/node_options.h',
        linesAdded: 1,
        linesDeleted: 0,
      },
    ],
  },
  {
    id: '408e8ce22ce7436e88a9977b4dc99fc3c431fc67',
    authorName: 'Michaël Zasso',
    relativeDate: '3 days ago',
    authorDate: 1537212012,
    message: 'doc: update maintaining V8 guide',
    body:
      'Replace references to the outdated `update-v8` tool to its replacementin `node-core-utils`PR-URL: https://github.com/nodejs/node/pull/22913Reviewed-By: Richard Lau <riclau@uk.ibm.com>Reviewed-By: Colin Ihrig <cjihrig@gmail.com>Reviewed-By: Weijia Wang <starkwang@126.com>Reviewed-By: Sakthipriyan Vairamani <thechargingvolcano@gmail.com>Reviewed-By: Joyee Cheung <joyeec9h3@gmail.com>Reviewed-By: Luigi Pinca <luigipinca@gmail.com>Reviewed-By: James M Snell <jasnell@gmail.com>',
    hash: '408e8ce22c',
    linesAdded: 8,
    linesDeleted: 8,
    files: [
      {
        name: 'doc/guides/maintaining-V8.md',
        linesAdded: 8,
        linesDeleted: 8,
      },
    ],
  },
  {
    id: '54af9738b9fad1c1e46ea9170037146324cd152e',
    authorName: 'Ruben Bridgewater',
    relativeDate: '3 days ago',
    authorDate: 1537269982,
    message: 'doc: specify fast-tracking',
    body:
      'Currently the documentation is not specific how fast-tracking shouldbe applied. This specifies exactly how things should be done to preventconfusion.PR-URL: https://github.com/nodejs/node/pull/22929Reviewed-By: Denys Otrishko <shishugi@gmail.com>Reviewed-By: Anna Henningsen <anna@addaleax.net>Reviewed-By: Tobias Nießen <tniessen@tnie.de>Reviewed-By: Vse Mozhet Byt <vsemozhetbyt@gmail.com>Reviewed-By: John-David Dalton <john.david.dalton@gmail.com>Reviewed-By: Matteo Collina <matteo.collina@gmail.com>Reviewed-By: Luigi Pinca <luigipinca@gmail.com>Reviewed-By: Michaël Zasso <targos@protonmail.com>Reviewed-By: Weijia Wang <starkwang@126.com>Reviewed-By: Richard Lau <riclau@uk.ibm.com>Reviewed-By: Matheus Marchini <mat@mmarchini.me>Reviewed-By: Sakthipriyan Vairamani <thechargingvolcano@gmail.com>Reviewed-By: Yuta Hiroto <hello@hiroppy.me>Reviewed-By: Rich Trott <rtrott@gmail.com>Reviewed-By: Trivikram Kamat <trivikr.dev@gmail.com>Reviewed-By: George Adams <george.adams@uk.ibm.com>',
    hash: '54af9738b9',
    linesAdded: 6,
    linesDeleted: 3,
    files: [
      {
        name: 'COLLABORATOR_GUIDE.md',
        linesAdded: 6,
        linesDeleted: 3,
      },
    ],
  },
];

export default fiveCommits;
