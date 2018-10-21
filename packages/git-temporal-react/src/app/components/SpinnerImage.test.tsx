import React from 'react';
import { shallow } from 'enzyme';

import { SpinnerImage } from './SpinnerImage';

describe('components/SpinnerImage', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<SpinnerImage />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
