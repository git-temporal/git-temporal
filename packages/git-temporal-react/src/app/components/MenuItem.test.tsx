import React from 'react';
import { shallow } from 'enzyme';

import { MenuItem } from './MenuItem';

describe('components/MenuItem', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    const onClickFn = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <MenuItem onClick={onClickFn}>this is the a menu item</MenuItem>
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
