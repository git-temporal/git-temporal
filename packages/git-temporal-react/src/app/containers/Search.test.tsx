import React from 'react';
import { shallow } from 'enzyme';
import * as actions from '../actions';

import { Search } from './Search';

describe('containers/Search', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      actions.setSearch.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<Search dispatch={mockDispatch} search="" />);
    });

    test('it should match snapshot (should render search without popup)', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Popup').props().isOpen).toEqual(false);
    });
  });
  describe('when rendered with search text', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<Search dispatch={mockDispatch} search="someone" />);
    });

    beforeEach(() => {
      // @ts-ignore
      actions.setSearch.mockClear();
      mockDispatch.mockClear();
    });

    test('it should match snapshot (it should have rendered search, but NOT the popup', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Popup').props().isOpen).toEqual(false);
    });

    test('and then on focus, it should show popup', () => {
      wrapper.instance().onSearchFocus();
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Popup').props().isOpen).toEqual(true);
    });
    test('and then on blur, it should hide popup', () => {
      wrapper.instance().onSearchBlur();
      wrapper.update();
      // expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Popup').props().isOpen).toEqual(false);
    });
    test('and then on focus, it should show popup', () => {
      wrapper.instance().onSearchFocus();
      wrapper.update();
      // expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Popup').props().isOpen).toEqual(true);
    });
    test('and then on clear, it should hide the popup', () => {
      wrapper.instance().onClear();
      wrapper.update();
      // TODO : there is not a really easy way of testing this because actions are mocked
      // expect(wrapper).toMatchSnapshot();
      // expect(wrapper.find('Popup').props().isOpen).toEqual(false);
    });

    test('on search should call setSearch', () => {
      wrapper.instance().onSearch('bob');
      expect(actions.setSearch).toHaveBeenCalledWith('bob');
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    const testArrowKey = (key, expected) => {
      const instance = wrapper.instance();
      instance.onKeyboard({
        key,
        preventDefault: jest.fn(),
      });
      wrapper.update();
      instance.onKeyboard({ preventDefault: jest.fn(), key: 'Enter' });
      wrapper.update();
      // note that the test above don't result in a props change so the value is
      // still the originally rendered search="someone"
      expect(actions.setSearch).toHaveBeenCalledWith(expected);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    };
    test('on ArrowDown and enter should select author: prefix', () => {
      testArrowKey('ArrowDown', 'author:someone');
    });
    test('on ArrowDown and enter should select commit: prefix', () => {
      testArrowKey('ArrowDown', 'commit:someone');
    });
    test('on ArrowDown and enter should select file: prefix', () => {
      testArrowKey('ArrowDown', 'file:someone');
    });
    test('on ArrowDown and enter should cycle back to the top of select without prefix', () => {
      testArrowKey('ArrowDown', 'someone');
    });
    test('on ArrowUp and enter should cycle back to the bottom of select file: prefix', () => {
      testArrowKey('ArrowUp', 'file:someone');
    });

    describe('...and then clicking menu items', () => {
      const suggestionsToTest = ['all', 'author:', 'commit:', 'file:'];
      beforeEach(() => {
        jest.clearAllMocks();
      });
      for (const suggestion of suggestionsToTest) {
        test(`it should call action in response to ${suggestion} suggestion click`, () => {
          wrapper.find({ value: suggestion }).simulate('click');
          expect(actions.setSearch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
        });
      }
    });
  });
});
