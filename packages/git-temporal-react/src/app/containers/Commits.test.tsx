import React from 'react';
import { mount } from 'enzyme';

import { Commits, mapStateToProps } from './Commits';
import commitsForPath from 'testHelpers/mocks/commitsForPath';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import tenCommits from 'testHelpers/mocks/tenCommits';

const filteredCommitsMock = {
  selectedPath: 'some/path',
  commits: fiveCommits,
  isFetching: false,
  didInvalidate: false,
  viewCommitsOrFiles: 'commits',
  highlightedCommitId: '56493bf1ebfab3ec102fe017f30fa4f81ba6a256',
  isFileSelected: false,
};

describe('containers/Commits', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = mount(
        <Commits dispatch={mockDispatch} {...filteredCommitsMock} />
      );
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing commits should render new list', () => {
      wrapper.setProps({ commits: tenCommits });
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when calling mapStateToProps()', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps(commitsForPath);
      expect(propsOut).toMatchSnapshot();
    });
  });
});
