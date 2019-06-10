import React from 'react';
import { shallow } from 'enzyme';

import { Authors } from './Authors';
import authorsAndStats from 'testHelpers/mocks/authorsAndStats';

describe('containers/Authors', () => {
  describe('when rendered mock authors and stats', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      debugger;
      mockDispatch = jest.fn();
      wrapper = shallow(<Authors />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with authors and stats ', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      debugger;
      mockDispatch = jest.fn();
      wrapper = shallow(<Authors />);
    });
    beforeEach(() => {
      mockDispatch.mockClear();
    });
    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('calling renderList() should render the list', () => {
      expect(wrapper.instance().renderList()).toMatchSnapshot();
    });
    test('calling renderRow() should render a row', () => {
      expect(
        wrapper.instance().renderRow({ index: 0, style: {}, key: 1 })
      ).toMatchSnapshot();
    });
  });
});
