jest.mock('app/actions', () => {
  const mockedActions = {};
  const actionsToMock = [
    'selectPath',
    'invalidatePath',
    'requestCommits',
    'receiveCommits',
    'fetchCommitsIfNeeded',
    'setAuthorsContainerSort',
    'setCommitsContainerSort',
    'setFilesContainerSort',
    'highlightCommit',
    'viewCommits',
    'viewFiles',
    'setStartDate',
    'setEndDate',
  ];
  for (const methodName of actionsToMock) {
    mockedActions[methodName] = jest.fn(path => {
      return jest.fn(() => {
        return path;
      });
    });
  }
  return mockedActions;
});
