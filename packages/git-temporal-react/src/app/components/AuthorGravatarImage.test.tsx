import React from 'react';
import { shallow } from 'enzyme';

import { AuthorGravatarImage } from './AuthorGravatarImage';

describe('components/AuthorGravatarImage', () => {
  describe('when rendered with times in order', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <AuthorGravatarImage emails={['bee.wilkerson@ymail.com']} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
