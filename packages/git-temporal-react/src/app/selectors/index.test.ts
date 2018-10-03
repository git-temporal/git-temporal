import * as selectors from '.';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import tenCommits from 'testHelpers/mocks/tenCommits';

const testStateBase = {
  commitsByPath: {
    testPath1: {
      isFetching: false,
      commits: fiveCommits,
    },
    testPath2: {
      isFetching: false,
      commits: tenCommits,
    },
  },
};

const testState1 = Object.assign({}, testStateBase, {
  selectedPath: 'testPath1',
});

const testState2 = Object.assign({}, testStateBase, {
  selectedPath: 'testPath2',
});

// TODO: this will need more work and testing.  Right now, getFilteredCommits
// hits all of the selectors up the line

describe('selectors/getFilteredCommits', () => {
  describe('with first 5 commits from node test repo', () => {
    let commitsOut;
    beforeAll(async () => {
      commitsOut = await selectors.getFilteredCommits(testState1);
      // console.log('got commits', commitsOut);
    });
    test('it should match snapshot', () => {
      expect(commitsOut).toMatchSnapshot();
    });
    test('it should have returned 5 commits for testPath1', () => {
      expect(commitsOut.commits.length).toBe(5);
    });
  });
  describe('with first 10 commits from react test repo', () => {
    let commitsOut;
    beforeAll(async () => {
      commitsOut = await selectors.getFilteredCommits(testState2);
      // console.log('got commits', commitsOut);
    });
    test('it should match snapshot', () => {
      expect(commitsOut).toMatchSnapshot();
    });
    test('it should have returned 10 commits for testPath2', () => {
      expect(commitsOut.commits.length).toBe(10);
    });
  });

  describe('when dealing with commit containing bad author name', () => {
    let commitsOut;
    beforeAll(async () => {
      const testState = Object.assign({}, testState1);
      testState.commitsByPath.testPath1.commits[0].authorName = null;

      commitsOut = await selectors.getFilteredCommits(testState);
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
      const testState = Object.assign({}, testStateBase, {
        selectedPath: 'some/bogus/path',
      });
      commitsOut = await selectors.getFilteredCommits(testState);
    });
    test('it should match snapshot', () => {
      expect(commitsOut).toMatchSnapshot();
    });
  });
});
