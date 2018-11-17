import React from 'react';
import { shallow } from 'enzyme';

import { Commits } from './Commits';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import tenCommits from 'testHelpers/mocks/tenCommits';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

const filteredCommitsMock = {
  selectedPath: 'some/path',
  commits: fiveCommits,
  isFetching: false,
  didInvalidate: false,
  viewCommitsOrFiles: 'commits',
  highlightedCommitIds: ['56493bf1ebfab3ec102fe017f30fa4f81ba6a256'],
  isFileSelected: false,
  commitsContainerSort: CommitsContainerSorts.TIME,
};

describe('containers/Commits', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    const mockEvent = { stopPropagation: jest.fn };
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <Commits dispatch={mockDispatch} {...filteredCommitsMock} />
      );
    });

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    test('and rendering List should return a List', () => {
      const listReturn = wrapper.instance().renderList(300, 0);
      expect(listReturn).toBeDefined();
    });

    test('and rendering row', () => {
      expect(
        wrapper.instance().renderRow({ index: 0, style: {}, key: 'test0' })
      ).toBeDefined();
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing commits should render new list', () => {
      wrapper.setProps({ commits: tenCommits });
      expect(wrapper).toMatchSnapshot();
    });

    test('when clicking on a CommitCard it should call dispatch', () => {
      wrapper.instance().onCommitCardClick(mockEvent, fiveCommits[0], 0);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('when clicking on files it should call dispatch', () => {
      wrapper.instance().onFileClick(mockEvent, 'some/bogus/file.js');
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
