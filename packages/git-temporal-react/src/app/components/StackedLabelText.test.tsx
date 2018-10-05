import React from 'react';
import { shallow } from 'enzyme';

import { StackedLabelText } from './StackedLabelText';

describe('components/StackedLabelText', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <StackedLabelText label="This is the Label" text="this is the text" />
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
