import React from 'react';
import { shallow } from 'enzyme';

import { SpinnerContainer } from './SpinnerContainer';

describe('components/SpinnerContainer', () => {
  describe('when rendered with isSelected=true', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <SpinnerContainer isSpinning={true}>
          This should be obscured
        </SpinnerContainer>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with isSelected=false', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <SpinnerContainer isSpinning={false}>
          This is should not be obscured
        </SpinnerContainer>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
