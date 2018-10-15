import * as selectors from '.';
import commitsForPath from 'testHelpers/mocks/commitsForPath';

const testState1 = commitsForPath;

// TODO: this will need more work and testing.  Right now, getFilteredCommitsState
// hits all of the selectors up the line

describe('selectors/getFilteredCommitsState', () => {
  describe('with first 5 commits from node test repo', () => {
    let commitsOut;
    beforeAll(async () => {
      commitsOut = await selectors.getFilteredCommitsState(testState1);
      // console.log('got commits', commitsOut);
    });
    test('it should match snapshot', () => {
      expect(commitsOut).toMatchSnapshot();
    });
    test('it should have returned 5 commits for testPath1', () => {
      expect(commitsOut.commits.length).toBe(5);
    });
  });

  describe('when dealing with commit containing bad author name', () => {
    let commitsOut;
    beforeAll(async () => {
      const testState = Object.assign({}, testState1);
      testState.commits[0].authorName = null;

      commitsOut = await selectors.getFilteredCommitsState(testState);
      // console.log('got commits', commitsOut);
    });
    test('it should match snapshot', () => {
      expect(commitsOut).toMatchSnapshot();
    });
    test('it should have returned 5 commits', () => {
      expect(commitsOut.commits.length).toBe(5);
    });
    test('first commit should not have an authorName', () => {
      expect(commitsOut.commits[0].authorName).toBe(null);
      expect(commitsOut.commits[1].authorName).not.toBe(null);
    });
  });

  describe('when asking for non existent path', () => {
    let commitsOut;
    beforeAll(async () => {
      const testState = Object.assign({}, testState1);
      testState.selectedPath = 'some/bogus/path';
      commitsOut = await selectors.getFilteredCommitsState(testState);
    });
    test('it should return an empty state', () => {
      expect(commitsOut).toMatchSnapshot();
    });
  });
});
