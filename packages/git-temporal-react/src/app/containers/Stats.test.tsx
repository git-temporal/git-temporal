import React from 'react';
import { shallow } from 'enzyme';

import { Stats, mapStateToProps } from './Stats';
import basicReduxState from 'testHelpers/mocks/basicReduxState';

const testProps = {
  authors: 5,
  minAuthorDate: 1536691136,
  maxAuthorDate: 1538663085,
  commits: 52,
  files: 110,
  linesAdded: 700,
  linesDeleted: 300,
};

describe('containers/Stats', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<Stats dispatch={mockDispatch} {...testProps} />);
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
