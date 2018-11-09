import React from 'react';
import { shallow } from 'enzyme';
import { selectPath } from 'app/actions';

import { Search } from './Search';

describe('containers/Search', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<Search dispatch={mockDispatch} search="" />);
    });

    test('it should match snapshot (should render search without popup)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with search text', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<Search dispatch={mockDispatch} search="someone" />);
    });

    test('it should match snapshot (it should have rendered search and the popup', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
