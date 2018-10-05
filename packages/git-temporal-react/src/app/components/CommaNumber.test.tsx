import React from 'react';
import { shallow } from 'enzyme';

import { CommaNumber } from './CommaNumber';

describe('components/CommaNumber', () => {
  describe('when rendered with value as string', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommaNumber value="100545007.02" />);
    });

    test('it should match snapshot (it should have rendered 100,545,007.02)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with value as numeric', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommaNumber value={100545007.02} />);
    });

    test('it should match snapshot (it should have rendered 100,545,007.02)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with non numeric value as string', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommaNumber value="NaN is not a number" />);
    });

    test('it should match snapshot (it should have rendered 0)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
