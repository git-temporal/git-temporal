import React from 'react';
import { shallow } from 'enzyme';

import { Authors, mapStateToProps } from './Authors';
import basicReduxState from 'testHelpers/mocks/basicReduxState';
import authorsAndStats from 'testHelpers/mocks/authorsAndStats';

describe('containers/Authors', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <Authors dispatch={mockDispatch} {...authorsAndStats} />
      );
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
