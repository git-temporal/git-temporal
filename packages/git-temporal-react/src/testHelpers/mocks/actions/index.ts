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
    'highlightCommits',
    'viewCommits',
    'viewFiles',
    'setStartDate',
    'setEndDate',
    'setSearch',
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
