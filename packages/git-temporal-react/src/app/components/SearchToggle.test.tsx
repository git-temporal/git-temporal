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
  });
});
