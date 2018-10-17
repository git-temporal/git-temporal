import reduxMockStore from 'redux-mock-store';
import reduxThunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import commitsForPath from 'testHelpers/mocks/commitsForPath';
import { ActionTypes } from 'app/actions/ActionTypes';

// actions is globally mocked for all tests
const actions = require.requireActual('./index');

const mockStore = reduxMockStore([reduxThunk.withExtraArgument({ fetch })]);

const nonExistentTestPath = 'testPath/no/exist';
const existingTestPath = 'testPath1'; // see mock for commits

describe('actions', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  test('fetchCommitsIfNeeded(existingPath) should not trigger any other actions', async done => {
    const store = mockStore(commitsForPath);
    await store.dispatch(actions.fetchCommitsIfNeeded(existingTestPath));
    expect(store.getActions()).toEqual([]);
    done();
  });

  test('fetchCommitsIfNeeded(existingPath) should not trigger any other actions if already fetching', async done => {
    const alteredState = Object.assign({}, commitsForPath);
    alteredState.isFetching = true;
    const store = mockStore(alteredState);
    await store.dispatch(actions.fetchCommitsIfNeeded(existingTestPath));
    expect(store.getActions()).toEqual([]);
    done();
  });

  test('fetchCommitsIfNeeded(nonExistentPath)', async done => {
    const store = mockStore(commitsForPath);
    fetchMock.getOnce('begin:http://localhost:11966/git-temporal/history', {
      body: JSON.stringify({
        commits: fiveCommits,
        path: nonExistentTestPath,
      }),
    });
    const expectedActions = [
      { type: ActionTypes.REQUEST_COMMITS, selectedPath: nonExistentTestPath },
      {
        type: ActionTypes.RECEIVE_COMMITS,
        selectedPath: nonExistentTestPath,
        commits: fiveCommits,
      },
    ];
    await store.dispatch(actions.fetchCommitsIfNeeded(nonExistentTestPath));
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  test('selectPath(nonExistentPath) should trigger fetch', async done => {
    const store = mockStore(commitsForPath);
    fetchMock.getOnce('begin:http://localhost:11966/git-temporal/history', {
      body: JSON.stringify(fiveCommits),
    });
    const expectedActions = [
      { type: ActionTypes.REQUEST_COMMITS, selectedPath: nonExistentTestPath },
    ];
    await store.dispatch(actions.selectPath(nonExistentTestPath));
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });
});
