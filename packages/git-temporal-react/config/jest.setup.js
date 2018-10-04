require('../../../babel-register');
require('../src/testHelpers/mocks/actions');

/* eslint-disable */
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({
  adapter: new Adapter(),
});
