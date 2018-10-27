import React from 'react';
import { shallow } from 'enzyme';

import { ToggleButton } from './ToggleButton';

describe('components/ToggleButton', () => {
  describe('when rendered with isSelected=false', () => {
    let wrapper;
    const onClickMock = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <ToggleButton isSelected={false} onClick={onClickMock}>
          ...
        </ToggleButton>
      );
    });
    test('it should match snapshot (should have rendered as selectable)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with isSelected=true', () => {
    let wrapper;
    const onClickMock = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <ToggleButton isSelected={true} onClick={onClickMock}>
          ...
        </ToggleButton>
      );
    });
    test('it should match snapshot (should have rendered as selected)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
