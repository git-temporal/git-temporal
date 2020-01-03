import * as commitReducers from 'app/reducers/commits';
import * as uiReducers from 'app/reducers/ui';
import { ActionTypes } from 'app/actions/ActionTypes';

// actions is globally mocked for all tests
// const actions = require.requireActual('app/actions');

// These tests are still somewhat contrived because they're based on a bunch of
// dummy content.
describe('reducers', () => {
  describe('commits', () => {
    const expectedWithoutPath = [];
    test('returns default state without an action.type', () => {
      expect(commitReducers.commits(expectedWithoutPath, {})).toEqual(
        expectedWithoutPath
      );
    });
  });

  // To be honest, I did this for test coverage.  If you look at the reducers tested here
  // they are all just simple switches that are not really fallible
  describe('when testing all-of-the-things', () => {
    const testsToRun = [
      {
        reducer: commitReducers.selectedPath,
        state: '',
        action: { selectedPath: '/some/path' },
      },
      {
        reducer: commitReducers.highlightedCommitIds,
        state: '',
        action: { commitIds: ['aphonyIdSTring'] },
      },
      { reducer: commitReducers.commits, state: [], action: { commits: [] } },
      { reducer: commitReducers.isFetching, state: false, action: {} },
      {
        reducer: uiReducers.rerenderRequestedAt,
        state: Date.now(),
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
