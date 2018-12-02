import React from 'react';
import { shallow } from 'enzyme';

import { Selectable } from './Selectable';

describe('components/Selectable', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    const onClickFn = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <Selectable onClick={onClickFn}>this is the a menu item</Selectable>
      );
    });

    test('it should match snapshot (it should have rendered a label and a text element)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
