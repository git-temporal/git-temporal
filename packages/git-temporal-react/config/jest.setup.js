require('../../../babel-register');
require('../src/testHelpers/mocks/actions');
// require('../src/testHelpers/mocks/monacoEditor');

global.Date.now = jest.fn(() => 1539563458 * 1000);

/* eslint-disable */
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({
  adapter: new Adapter(),
});
