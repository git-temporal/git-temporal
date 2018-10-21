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
      wrapper = shallow(
        <Authors dispatch={mockDispatch} {...authorsAndStats} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered mock filteredAuthors ', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      debugger;
      mockDispatch = jest.fn();
      wrapper = shallow(
        <Authors dispatch={mockDispatch} {...authorsAndStats} />
      );
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
    test('calling onAuthorFilterToggle("bob", true) should dispatch removeAuthorFilter', () => {
      wrapper.instance().onAuthorFilterToggle('bob', true);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test('calling onAuthorFilterToggle("bob", false) should dispatch removeAuthorFilter', () => {
      wrapper.instance().onAuthorFilterToggle('bob', false);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
