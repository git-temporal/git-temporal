import React from 'react';
import { shallow } from 'enzyme';

import { ActionMenu } from './ActionMenu';

describe('components/ActionMenu', () => {
  describe('when rendered with text child', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <ActionMenu isMenuOpen={true} onMenuToggle={jest.fn()}>
          this is a menu (or anything really)
        </ActionMenu>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
