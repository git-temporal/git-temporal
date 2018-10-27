import React from 'react';
import { shallow } from 'enzyme';

import { StackedLabel } from './StackedLabel';

describe('components/StackedLabel', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <StackedLabel label="This is the Label">this is the text</StackedLabel>
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('and then setting "selected" prop, it should match snapshot (it should have changed style from first snapshot)', () => {
      wrapper.setProps({ selected: true });
      expect(wrapper).toMatchSnapshot();
    });
    test('and then setting "onLabelClick" prop, it should match snapshot (it should have changed style from first snapshot)', () => {
      wrapper.setProps({ selected: false, onLabelClick: jest.fn() });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
