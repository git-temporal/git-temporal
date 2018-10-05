import React from 'react';
import { shallow } from 'enzyme';

import { EpochSpan } from './EpochSpan';

const firstEpochTime = 1536691136;
const secondEpochTime = 1538704960;

describe('components/EpochSpan', () => {
  describe('when rendered with times in order', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <EpochSpan
          firstEpochTime={firstEpochTime}
          secondEpochTime={secondEpochTime}
        />
      );
    });

    test('it should match snapshot (it should have rendered "3 weeks")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with times in reverse order', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <EpochSpan
          firstEpochTime={secondEpochTime}
          secondEpochTime={firstEpochTime}
        />
      );
    });

    test('it should match snapshot (it should still have rendered "3 weeks")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
