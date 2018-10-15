import * as reducers from 'app/reducers';

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
});
