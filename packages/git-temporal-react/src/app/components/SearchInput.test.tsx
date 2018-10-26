import React from 'react';
import { shallow } from 'enzyme';

import { SearchInput } from './SearchInput';

describe('components/SearchInput', () => {
  describe('when rendered with value', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <SearchInput
          value={'test value'}
          onChange={jest.fn()}
          onClear={jest.fn}
        />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
