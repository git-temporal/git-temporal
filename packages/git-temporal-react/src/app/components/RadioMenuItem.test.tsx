import React from 'react';
import { shallow } from 'enzyme';

import { RadioMenuItem } from './RadioMenuItem';

describe('components/RadioMenuItem', () => {
  describe('when rendered with isSelected=true', () => {
    const clickFn = jest.fn();
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <RadioMenuItem isSelected={true} onClick={clickFn}>
          This is a radio menu item
        </RadioMenuItem>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with isSelected=false', () => {
    const clickFn = jest.fn();
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <RadioMenuItem isSelected={false} onClick={clickFn}>
          This is a radio menu item
        </RadioMenuItem>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
