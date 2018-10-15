import React from 'react';
import { mount } from 'enzyme';

import { Authors, mapStateToProps } from './Authors';
import commitsForPath from 'testHelpers/mocks/commitsForPath';
import authorsAndStats from 'testHelpers/mocks/authorsAndStats';

describe('containers/Authors', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = mount(<Authors dispatch={mockDispatch} {...authorsAndStats} />);
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
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
