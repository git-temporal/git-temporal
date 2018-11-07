import React from 'react';
import { shallow } from 'enzyme';

import { EpochDateTime } from './EpochDateTime';

describe('components/EpochDateTime', () => {
  describe('when rendered epoch time 1539369263 (Fri, 12 Oct 2018 18:34:23 GMT)', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<EpochDateTime value={1539369263} />);
    });

    test('it should match snapshot (it should have rendered "3 weeks")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
