import React from 'react';
import { mount } from 'enzyme';

import fiveCommits from 'testHelpers/mocks/fiveCommits';
import { Timeplot } from './Timeplot';

describe('components/Timeplot', () => {
  describe('when rendered', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = mount(
        <Timeplot
          selectedPath="some/path/to/nowhere"
          highlightedCommitId={fiveCommits[2].id}
          commits={fiveCommits}
          authors={6}
          startDate={fiveCommits[3].authorDate}
          endDate={fiveCommits[2].authorDate}
          dispatch={jest.fn()}
        />
      );
    });

    test('it should match snapshot (it should have rendered a block element for each line with <br><br>")', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing the startDate', () => {
      wrapper.setProps({ startDate: fiveCommits[4].authorDate + 1 });
    });

    test('onMouseDown with shiftKey should set dates', () => {
      wrapper
        .instance()
        .onMouseDown(
          { shiftKey: true },
          { startDate: new Date(fiveCommits[3].authorDate * 1000) }
        );
    });
    test('onMouseUp with shiftKey should set dates', () => {
      wrapper
        .instance()
        .onMouseDown(
          { shiftKey: false },
          { startDate: new Date(fiveCommits[4].authorDate * 1000) }
        );
    });

    test('onMouseUp without shiftKey should set dates', () => {
      wrapper
        .instance()
        .onMouseDown(
          { shiftKey: false },
          { startDate: new Date(fiveCommits[3].authorDate * 1000) }
        );
    });
  });
});
