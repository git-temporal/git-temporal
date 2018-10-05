import React from 'react';
import { shallow } from 'enzyme';
import { selectPath } from 'app/actions';
import fiveCommits from 'testHelpers/mocks/fiveCommits';
import basicReduxState from 'testHelpers/mocks/basicReduxState';

// debugger;

import { GitTemporal, mapStateToProps } from './GitTemporal';

describe('app/GitTemporal', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<GitTemporal dispatch={mockDispatch} path="" />);
    });

    test('it should match snapshot (it should be showing empty indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have dispatched a selectPath action', () => {
      expect(mockDispatch.mock.calls.length).toBe(1);
      // @ts-ignore
      expect(selectPath.mock.calls.length).toBe(1);
    });
  });

  describe('when rendered with commits and isFetching', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(
        <GitTemporal
          dispatch={mockDispatch}
          path=""
          commits={fiveCommits}
          isFetching={true}
        />
      );
    });

    test('it should match snapshot (it should show loading indicator)', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('it should have dispatched a selectPath action', () => {
      expect(mockDispatch.mock.calls.length).toBe(1);
      // @ts-ignore
      expect(selectPath.mock.calls.length).toBe(1);
    });
  });
  describe('when rendered with commits and not fetching', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(
        <GitTemporal
          dispatch={mockDispatch}
          path=""
          commits={fiveCommits}
          isFetching={false}
        />
      );
    });

    test('it should match snapshot (it should be showing commits)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have dispatched a selectPath action', () => {
      expect(mockDispatch.mock.calls.length).toBe(1);
      // @ts-ignore
      expect(selectPath.mock.calls.length).toBe(1);
    });
  });

  describe('when changing path prop', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(
        <GitTemporal
          dispatch={mockDispatch}
          path="this/path"
          commits={fiveCommits}
          isFetching={false}
        />
      );
      wrapper.setProps({ path: 'some/other/path' });
      // do it twice to confirm that it shouldn't trigger dispatches etc.,
      // unless the path actually changes
      wrapper.setProps({ path: 'some/other/path' });
    });

    test('it should match snapshot (should still be showing commits)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have called selectPath twice', () => {
      // one on initial render and then again when the prop changed
      expect(mockDispatch.mock.calls.length).toBe(2);
      // @ts-ignore
      expect(selectPath.mock.calls.length).toBe(2);
    });
  });

  describe('when calling mapStateToProps() with basisReduxState', () => {
    test('it should respond with props', () => {
      const propsOut = mapStateToProps(basicReduxState);
      expect(propsOut).toMatchSnapshot();
    });
  });
});
