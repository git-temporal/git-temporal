import React from 'react';
import { shallow } from 'enzyme';

import { StackedLabelHeader } from './StackedLabelHeader';

describe('components/StackedLabelHeader', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <StackedLabelHeader label="This is the Label">
          this is the text
        </StackedLabelHeader>
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
