/* eslint global-require: 0 */
/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const _ = require('underscore');
// @ts-ignore
const fetch = require('node-fetch');

const { debug } = require('common/logger');

const firstTenExpectedCommits = require('../../test/data/first10CommitsHere.json');

// This will start the API server on a port not in use by the dev server
const testPort = '11967';
process.env.GT_API_PORT = testPort;

const historyUrl = `http://localhost:${testPort}/git-temporal/history`;
const rangeUrl = `http://localhost:${testPort}/git-temporal/commitRange`;
const testPath = 'packages/api-node-express';
const testPathFile = 'packages/api-node-express/src/server.ts';

describe('packages/api-node-express', () => {
  let server;
  beforeAll(() => {
    server = require('../server').default;
  });
  afterAll(async () => {
    await server.close();
  });

  describe('git-temporal/history API', () => {
    describe('when fetched for whole git-temporal repo', () => {
      let allCommits;

      beforeAll(async () => {
        require('../server');
        const fetchResult = await fetch(historyUrl);
        allCommits = await fetchResult.json();

        debug('got commits', allCommits.commits.length);
        // console.log('first commit', allCommits.commits[0]);
        // console.log('last commit', allCommits.commits.slice(-1));
      }, 20000);

      it('should have over 30 commits', () => {
        expect(allCommits.commits.length).toBeGreaterThan(30);
      });
    });
  });
});
