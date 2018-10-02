import React from 'react';
import { shallow } from 'enzyme';
import { selectPath } from './actions';

debugger;

jest.mock('./actions', () => {
  const mockedActions = {};
  const actionsToMock = ['selectPath'];
  for (const methodName of actionsToMock) {
    mockedActions[methodName] = jest.fn(path => {
      return jest.fn(() => {
        return path;
      });
    });
  }
  return mockedActions;
});

import { GitTemporal } from './GitTemporal';

describe('components/GitTemporal', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(<GitTemporal dispatch={mockDispatch} path="" />);
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have dispatched a selectPath action', () => {
      expect(mockDispatch.mock.calls.length).toBe(1);
      // @ts-ignore
      expect(selectPath.mock.calls.length).toBe(1);
    });
  });
});
