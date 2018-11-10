import React from 'react';
import { shallow } from 'enzyme';

import { SearchToggle } from './SearchToggle';

describe('components/SearchToggle', () => {
  describe('when rendered with value', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <SearchToggle value={'test value'} onChange={jest.fn()} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have rendered a SearchInput', () => {
      expect(wrapper.find('SearchInput').length).toBe(1);
    });
  });
  describe('when rendered without a value', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<SearchToggle value={''} onChange={jest.fn()} />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have only rendered a SearchIcon', () => {
      expect(wrapper.find('SearchIcon').length).toBe(1);
      expect(wrapper.find('SearchInput').length).toBe(0);
    });

    test('and then clicking the SearchIcon, should render a SearchInput', () => {
      wrapper.find('div').simulate('click');
      expect(wrapper.find('SearchInput').length).toBe(1);
    });

    test('and then clicking the the close on Search input, should render icon', () => {
      wrapper.find('SearchInput').prop('onClear')();
      expect(wrapper.find('SearchIcon').length).toBe(1);
      expect(wrapper.find('SearchInput').length).toBe(0);
    });
  });
});
