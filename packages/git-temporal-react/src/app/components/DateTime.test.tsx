import React from 'react';
import { shallow } from 'enzyme';

import { DateTime } from './DateTime';

describe('components/DateTime', () => {
  describe('when rendered epoch time 1539369263 (Fri, 12 Oct 2018 18:34:23 GMT)', () => {
    let wrapper;
    beforeAll(() => {
      const testDate = new Date(1539369263 * 1000);
      wrapper = shallow(<DateTime value={testDate} />);
    });

    test('it should match snapshot (it should have rendered "3 weeks")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
