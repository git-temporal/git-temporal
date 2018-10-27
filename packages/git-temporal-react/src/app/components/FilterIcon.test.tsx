import React from 'react';
import { shallow } from 'enzyme';

import { FilterIcon } from './FilterIcon';

describe('components/FilterIcon', () => {
  describe('when rendered', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<FilterIcon />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
