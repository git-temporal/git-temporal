import React from 'react';
import { shallow } from 'enzyme';
import { selectPath } from 'app/actions';

import { Header, mapStateToProps } from './Header';

const testPath = 'some/contrived/path/file';

describe('containers/Header', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<Header dispatch={mockDispatch} selectedPath="" />);
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when calling mapStateToProps()', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps({ selectedPath: testPath });
      expect(propsOut.selectedPath).toBe(testPath);
    });
  });
});
