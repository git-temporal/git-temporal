import React from 'react';
import { shallow } from 'enzyme';

import { AuthorGravatarImage } from './AuthorGravatarImage';
// import { AuthorPlaceholderImage } from './AuthorPlaceholderImage';

describe('components/AuthorGravatarImage', () => {
  describe('when rendered with a single email', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <AuthorGravatarImage emails={['bee.wilkerson@ymail.com']} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('and then updating props, should match snapshot (should be different src than the other snapshot)', () => {
      wrapper.setProps({ emails: ['someone.else@wherever.com'] });
      expect(wrapper).toMatchSnapshot();
    });
    test('and then when image not found, should match snapshot (should render AuthorPlaceholderImage)', () => {
      wrapper.instance().onImageNotFound();
      expect(wrapper).toMatchSnapshot();
      // console.log(wrapper.html());
      expect(wrapper.find('AuthorPlaceholderImage').length).toBe(1);
    });
  });
});
