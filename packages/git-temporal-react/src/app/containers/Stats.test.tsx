import React from 'react';
import { shallow } from 'enzyme';

import { Stats } from './Stats';
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
};

global.Date.now = jest.fn(() => 1539563458 * 1000);

describe('containers/Stats', () => {
  describe('when rendered test props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<Stats />);
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
});
