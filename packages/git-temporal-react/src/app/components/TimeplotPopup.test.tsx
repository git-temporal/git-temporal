import React from 'react';
import { shallow } from 'enzyme';

import { TimeplotPopup } from './TimeplotPopup';
import fiveCommits from 'testHelpers/mocks/fiveCommits';

describe('components/TimeplotPopup', () => {
  describe('when rendered with all of the things', () => {
    let wrapper;

    beforeAll(() => {
      const startDate = new Date((fiveCommits[3].authorDate + 1) * 1000);
      const endDate = new Date((fiveCommits[2].authorDate - 1) * 1000);
      wrapper = shallow(
        <TimeplotPopup
          commits={fiveCommits}
          startDate={startDate}
          endDate={endDate}
          left={0}
          isOpen={true}
          onClose={jest.fn()}
          onCommitSelected={jest.fn()}
        />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
