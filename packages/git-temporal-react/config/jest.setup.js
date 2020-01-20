require('../../../babel-register');
require('../src/testHelpers/mocks/actions');
require('../src/testHelpers/mocks/monacoEditor');

require('@testing-library/jest-dom');

global.Date.now = jest.fn(() => 1539563458 * 1000);

// NOTE:  Enzyme is being deprecated in favor of React Testing Library.

/* eslint-disable */
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({
  adapter: new Adapter(),
});
