import * as reducers from 'app/reducers';
import { ActionTypes } from 'app/actions/ActionTypes';

// actions is globally mocked for all tests
// const actions = require.requireActual('app/actions');

// These tests are still somewhat contrived because they're based on a bunch of
// dummy content.
describe('reducers', () => {
  describe('commits', () => {
    const expectedWithoutPath = [];
    test('returns default state without an action.type', () => {
      expect(reducers.commits(expectedWithoutPath, {})).toEqual(
        expectedWithoutPath
      );
    });
  });

  // To be honest, I did this for test coverage.  If you look at the reducers tested here
  // they are all just simple switches that are not really fallible
  describe('when testing all-of-the-things', () => {
    const testsToRun = [
      {
        reducer: reducers.selectedPath,
        state: '',
        action: { selectedPath: '/some/path' },
      },
      {
        reducer: reducers.highlightedCommitId,
        state: '',
        action: { commitId: 'aphonyIdSTring' },
      },
      {
        reducer: reducers.viewCommitsOrFiles,
        state: '',
        action: {},
      },
      {
        reducer: reducers.commits,
        state: [],
        action: { commits: [] },
      },
      {
        reducer: reducers.isFetching,
        state: false,
        action: {},
      },
      {
        reducer: reducers.didInvalidate,
        state: false,
        action: {},
      },
    ];
    test('It should always return a state for tested ActionTypes', () => {
      for (const test of testsToRun) {
        for (const actionTypeKey of Object.keys(ActionTypes)) {
          const action = Object.assign({}, test.action, {
            type: ActionTypes[actionTypeKey],
          });
          const fn = test.reducer as any;
          expect(fn(test.state, action)).toBeDefined();
        }
      }
    });
  });
});
