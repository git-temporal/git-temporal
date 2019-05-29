import * as selectors from '.';
import commitsForPath from 'testHelpers/mocks/commitsForPath';

const testState1 = commitsForPath;

// TODO: this will need more work and testing.  Right now, getCommitsContainerState
// hits all of the selectors up the line

describe('selectors/getCommitsContainerState', () => {
  describe('with first 5 commits from node test repo', () => {
    let commitsOut;
    beforeAll(async () => {
      commitsOut = await selectors.getCommitsContainerState(testState1);
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

      commitsOut = await selectors.getCommitsContainerState(testState);
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
      commitsOut = await selectors.getCommitsContainerState(testState);
    });
    test('it should return an empty state', () => {
      expect(commitsOut).toMatchSnapshot();
    });
  });

  describe('when calling getFilesContainerState() with search', () => {
    test('it should have returned files in the container state', async () => {
      const testState = Object.assign({}, testState1);
      testState.search = 'options';
      const containerState = await selectors.getFilesContainerState(testState);
      expect(containerState.files.length).toBeGreaterThan(0);
    });
  });

  describe('when calling getFilesContainerState() with "file=..."search', () => {
    test('it should have returned files in the container state', async () => {
      const testState = Object.assign({}, testState1);
      testState.search = 'file=options';
      const containerState = await selectors.getFilesContainerState(testState);
      expect(containerState.files.length).toBeGreaterThan(0);
    });
  });
});
