import React from 'react';
import { shallow } from 'enzyme';

import { ResetLink } from './ResetLink';

describe('components/ResetLink', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    const onClick = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <ResetLink onClick={onClick}>this is the text</ResetLink>
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
