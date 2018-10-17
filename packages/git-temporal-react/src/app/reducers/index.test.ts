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
  describe('filteredAuthors', () => {
    const initialState = ['Author One', 'Author Two', 'Author Three'];
    test('returns default state without an action.type', () => {
      expect(reducers.filteredAuthors(initialState, {})).toEqual(initialState);
    });
    test('returns no authors state with action.type=REMOVE_ALL_AUTHOR_FILTERS', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.REMOVE_ALL_AUTHOR_FILTERS,
        })
      ).toEqual([]);
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
    });
    test('returns two authors when one is removed from three', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.REMOVE_AUTHOR_FILTER,
          authorName: 'Author Three',
        })
      ).toEqual(['Author One', 'Author Two']);
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
    });
    test('returns four authors when one is added to three', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.ADD_AUTHOR_FILTER,
          authorName: 'Author Four',
        })
      ).toEqual(initialState.slice(0).concat(['Author Four']));
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
    });
    test('Adding existing author filter should have no effect on state', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.ADD_AUTHOR_FILTER,
          authorName: 'Author Two',
        })
      ).toEqual(initialState);
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
    });
    test('Remove nonexisting author filter should have no effect on state', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.REMOVE_AUTHOR_FILTER,
          authorName: 'Author Four',
        })
      ).toEqual(initialState);
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
    });
    test('It should remove all author filters when new commit data is requested', () => {
      expect(
        reducers.filteredAuthors(initialState, {
          type: ActionTypes.REQUEST_COMMITS,
        })
      ).toEqual([]);
      // it should have not modified the initialState'
      expect(initialState.length).toBe(3);
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
