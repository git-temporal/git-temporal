import React from 'react';
import { shallow } from 'enzyme';

import { SearchIcon } from './SearchIcon';

describe('components/SearchIcon', () => {
  describe('when rendered', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<SearchIcon />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
