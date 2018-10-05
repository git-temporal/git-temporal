import * as reducers from 'app/reducers';

// actions is globally mocked for all tests
// const actions = require.requireActual('app/actions');

// These tests are still somewhat contrived because they're based on a bunch of
// dummy content.
describe('reducers', () => {
  describe('commitsByPath', () => {
    const expectedWithoutPath = {
      undefined: { commits: [], didInvalidate: true, isFetching: false },
    };
    test('returns default state', () => {
      expect(reducers.commitsByPath(undefined, {})).toEqual(
        expectedWithoutPath
      );
    });
  });
});
