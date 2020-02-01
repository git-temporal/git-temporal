/* eslint global-require: 0 */
/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
const { debug } = require('common/logger');

// This will start the API server on a port not in use by the dev server
// @ts-ignore
const testPort = '11968';
process.env.GT_API_PORT = testPort;

const historyUrl = `http://localhost:${testPort}/git-temporal/history`;
const rangeUrl = `http://localhost:${testPort}/git-temporal/commitRange`;
const diffUrl = `http://localhost:${testPort}/git-temporal/diff?path=.&leftCommit=8ce386cf62b8172895d58cb8dc87bb4b7a7a5e32&rightCommit=972d8ec0891ee414d1f33ff70201d7efe76ce245`;

describe('packages/api-node-express', () => {
  let server;
  beforeAll(() => {
    server = require('./server').default;
  });
  afterAll(async () => {
    await server.close();
  });

  describe('git-temporal/history API', () => {
    describe('when fetched for whole git-temporal repo', () => {
      let allCommits;

      beforeAll(async () => {
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

  describe('git-temporal/commitRange API', () => {
    describe('when fetched for whole git-temporal repo', () => {
      let commitRange;

      beforeAll(async () => {
        const fetchResult = await fetch(rangeUrl);
        commitRange = await fetchResult.json();

        debug('got commitRange', commitRange);
        // console.log('first commit', allCommits.commits[0]);
        // console.log('last commit', allCommits.commits.slice(-1));
      }, 20000);

      it('should have over 30 commits', () => {
        expect(commitRange.count).toBeGreaterThan(30);
      });
      it('first commit should match snapshot', () => {
        expect(commitRange.firstCommit).toMatchSnapshot();
      });
    });
  });

  describe('git-temporal/diff API', () => {
    describe('when fetched for 2 known commits', () => {
      let diff;

      beforeAll(async () => {
        const url = `${diffUrl}?`;
        const fetchResult = await fetch(url);
        diff = await fetchResult.json();
        debug('got diff', diff);
        // console.log('first commit', allCommits.commits[0]);
        // console.log('last commit', allCommits.commits.slice(-1));
      }, 20000);

      it('should match snapshot', () => {
        expect(diff).toMatchSnapshot();
      });
    });
  });
});
