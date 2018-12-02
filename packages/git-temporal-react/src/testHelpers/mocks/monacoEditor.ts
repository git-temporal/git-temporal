jest.mock('monaco-editor', () => {
  return {
    editor: {
      createModel: jest.fn(),
      createDiffEditor: () => {
        return {
          setModel: jest.fn(),
        };
      },
    },
  };
});
