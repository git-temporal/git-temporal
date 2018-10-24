import React from 'react';
import { shallow } from 'enzyme';

import { Stats, mapStateToProps, CommitsOrFiles } from './Stats';
import commitsForPath from 'testHelpers/mocks/commitsForPath';

const testProps = {
  authors: 5,
  minAuthorDate: 1536691136,
  maxAuthorDate: 1538663085,
  commits: 52,
  files: 110,
  linesAdded: 700,
  linesDeleted: 300,
  isFileSelected: false,
  viewCommitsOrFiles: CommitsOrFiles.COMMITS,
};

global.Date.now = jest.fn(() => 1539563458 * 1000);

describe('containers/Stats', () => {
  describe('when rendered test props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<Stats dispatch={mockDispatch} {...testProps} />);
    });
    beforeEach(() => {
      mockDispatch.mockClear();
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('when clicking on commits it should call dispatch', () => {
      wrapper.instance().onCommitsClick();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test('when clicking on files it should call dispatch', () => {
      wrapper.instance().onFilesClick();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
  describe('when rendered and a directory is selected', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      const dirTestProps = Object.assign({}, testProps, {
        isFileSelected: true,
        viewCommitsOrFiles: CommitsOrFiles.FILES,
      });
      mockDispatch = jest.fn();
      wrapper = shallow(<Stats dispatch={mockDispatch} {...dirTestProps} />);
    });
    beforeEach(() => {
      mockDispatch.mockClear();
    });

    test('it should match snapshot (it should be showing Commits selected)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should call dispatch to change to CommitsOrFiles.COMMITS onComponentDidMount', () => {
      wrapper.instance().componentDidMount();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('it should call dispatch to change to CommitsOrFiles.COMMITS onComponentDidUpdate', () => {
      wrapper.instance().componentDidUpdate();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('when calling mapStateToProps()', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps(commitsForPath);
      expect(propsOut).toMatchSnapshot();
    });
  });
});
