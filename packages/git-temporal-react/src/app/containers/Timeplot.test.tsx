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
          highlightedCommitIds={[fiveCommits[2].id]}
          commits={fiveCommits}
          totalCommits={5}
          authors={6}
          isFetching={false}
          startDate={fiveCommits[3].authorDate}
          endDate={fiveCommits[2].authorDate}
          earliestCommitDate={fiveCommits[0].authorDate}
          latestCommitDate={fiveCommits.slice(-1)[0].authorDate}
          rerenderRequestedAt={null}
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
          { shiftKey: true, preventDefault: jest.fn() },
          { startDate: new Date(fiveCommits[3].authorDate * 1000) }
        );
    });
    test('onMouseUp with shiftKey should set dates', () => {
      wrapper
        .instance()
        .onMouseDown(
          { shiftKey: false, preventDefault: jest.fn() },
          { startDate: new Date(fiveCommits[4].authorDate * 1000) }
        );
    });

    test('onMouseUp without shiftKey should set dates', () => {
      wrapper
        .instance()
        .onMouseDown(
          { shiftKey: false, preventDefault: jest.fn() },
          { startDate: new Date(fiveCommits[3].authorDate * 1000) }
        );
    });
  });
});
