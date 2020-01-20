import React from 'react';
import { mount } from 'enzyme';

import { TimeplotGraph } from './TimeplotGraph';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import tenCommits from 'testHelpers/mocks/tenCommits';

describe('components/TimeplotGraph', () => {
  describe('when rendered with five commits, start and end dates)', () => {
    let wrapper;
    let renderSpy;

    beforeAll(() => {
      // @ts-ignore
      renderSpy = jest.spyOn(TimeplotGraph.prototype, 'renderTimeplotGraph');
      wrapper = mount(
        <TimeplotGraph
          commits={fiveCommits}
          startDate={fiveCommits[3].authorDate + 1}
          endDate={fiveCommits[2].authorDate - 1}
          earliestCommitDate={fiveCommits[0].authorDate}
          latestCommitDate={fiveCommits.slice(-1)[0].authorDate}
        />
      );
      wrapper.instance().focus();
    });

    beforeEach(() => {
      renderSpy.mockReset();
    });

    test('it should match snapshot (it should have rendered a block element for each line with <br><br>")', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing commits rendered should rerender with 10 commits', () => {
      wrapper.setProps({ commits: tenCommits });
      expect(wrapper).toMatchSnapshot();
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('and then changing one of the ten commits, it should rerender', () => {
      // have to deep copy the array to avoid changing prev commits too
      const newCommits = tenCommits.map(commit => Object.assign({}, commit));
      newCommits[4].id = 'testId';
      wrapper.setProps({ commits: newCommits });
      expect(wrapper).toMatchSnapshot();
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('when rendered with five commits, start and end dates, and callbacks)', () => {
    let wrapper;
    const onMouseEnterMock = jest.fn();
    const onMouseLeaveMock = jest.fn();
    const onMouseMoveMock = jest.fn();
    const onMouseDownMock = jest.fn();
    const onMouseUpMock = jest.fn();

    beforeAll(() => {
      wrapper = mount(
        <TimeplotGraph
          commits={fiveCommits}
          startDate={fiveCommits[3].authorDate + 1}
          endDate={fiveCommits[2].authorDate - 1}
          earliestCommitDate={fiveCommits[0].authorDate}
          latestCommitDate={fiveCommits.slice(-1)[0].authorDate}
          onMouseEnter={onMouseEnterMock}
          onMouseLeave={onMouseLeaveMock}
          onMouseMove={onMouseMoveMock}
          onMouseDown={onMouseDownMock}
          onMouseUp={onMouseUpMock}
        />
      );
      wrapper.instance().calibrateScales();
      wrapper.instance().focus();
    });

    test('MouseEnter should callback onMouseEnter', () => {
      wrapper.simulate('mouseenter');
      expect(onMouseEnterMock).toHaveBeenCalledTimes(1);
    });
    test('MouseLeave should callback onMouseLeave', () => {
      wrapper.simulate('mouseleave');
      expect(onMouseLeaveMock).toHaveBeenCalledTimes(1);
    });
    test('MouseMove should callback onMouseMove', () => {
      wrapper.simulate('mousemove');
      expect(onMouseMoveMock).toHaveBeenCalledTimes(1);
    });
    test('MouseDown should callback onMouseDown', () => {
      wrapper.simulate('mousedown');
      expect(onMouseDownMock).toHaveBeenCalledTimes(1);
    });
    test('MouseUp should callback onMouseUp', () => {
      wrapper.simulate('mouseup');
      expect(onMouseUpMock).toHaveBeenCalledTimes(1);
    });
  });
});
