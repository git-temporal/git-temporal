const setModelMock = jest.fn();

const mockEditor = {
  editor: {
    createModel: jest.fn(),
    createDiffEditor: () => {
      return { setModel: setModelMock };
    },
  },
};

// jest.mock('monaco-editor', () => {
//   return {};
// });

module.exports = {
  mockEditor,
};
