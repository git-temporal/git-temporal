import React from 'react';
import { shallow } from 'enzyme';

import { AuthorPlaceholderImage } from './AuthorPlaceholderImage';

describe('components/AuthorPlaceholderImage', () => {
  describe('when rendered with times in order', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<AuthorPlaceholderImage />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
