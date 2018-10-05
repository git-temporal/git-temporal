import React from 'react';
import { shallow } from 'enzyme';

import { StackedHeaderText } from './StackedHeaderText';

describe('components/StackedHeaderText', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <StackedHeaderText label="This is the Label" text="this is the text" />
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
