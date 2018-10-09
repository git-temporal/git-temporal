import React from 'react';
import { mount } from 'enzyme';

import { Files, mapStateToProps } from './Files';
import basicReduxState from 'testHelpers/mocks/basicReduxState';
import filesAndStats from 'testHelpers/mocks/filesAndStats';

describe('containers/Files', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = mount(<Files dispatch={mockDispatch} {...filesAndStats} />);
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when calling mapStateToProps()', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps(basicReduxState);
      expect(propsOut).toMatchSnapshot();
    });
  });
});
