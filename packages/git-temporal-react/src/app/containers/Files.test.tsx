import React from 'react';
import { shallow } from 'enzyme';

import { Files, mapStateToProps } from './Files';
import commitsForPath from 'testHelpers/mocks/commitsForPath';
import filesAndStats from 'testHelpers/mocks/filesAndStats';

describe('containers/Files', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<Files dispatch={mockDispatch} {...filesAndStats} />);
    });

    test('it should match snapshot (it should be showing files)', () => {
      expect(wrapper).toMatchSnapshot();
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
    test('and then clicking on a file', () => {
      const mockEvent = {
        stopPropagation: jest.fn(),
      };
      wrapper.instance().onFileClick(mockEvent, 'some/file/path');
      expect(mockDispatch).toBeCalled();
      expect(mockEvent.stopPropagation).toBeCalled();
    });
  });
  describe('when calling mapStateToProps()', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps(commitsForPath);
      expect(propsOut).toMatchSnapshot();
    });
  });
});
