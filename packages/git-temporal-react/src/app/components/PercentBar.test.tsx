import React from 'react';
import { shallow } from 'enzyme';

import { PercentBar } from './PercentBar';

describe('components/PercentBar', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<PercentBar numerator={70} denominator={100} />);
    });

    test('it should match snapshot (it should have rendered a 70% width div within a 100% width div)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
