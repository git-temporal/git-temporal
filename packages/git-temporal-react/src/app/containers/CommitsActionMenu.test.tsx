import React from 'react';
import * as actions from 'app/actions';
import CommitsActionMenu from './CommitsActionMenu';

import { fireEvent } from '@testing-library/react';
import { mountConnected } from 'testHelpers';

describe('containers/CommitsActionMenu', () => {
  describe('when rendered with mock redux store', () => {
    test('it should match snapshot', () => {
      const { wrapper } = mountConnected(<CommitsActionMenu />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    describe('...and then clicking menu items', () => {
      const menusToTest = [
        { testId: 'sortTime', actionFn: actions.setCommitsContainerSort },
        { testId: 'sortLines', actionFn: actions.setCommitsContainerSort },
      ];
      beforeEach(() => {
        jest.clearAllMocks();
      });
      for (const menuTest of menusToTest) {
        test(`it should call actions in response to ${
          menuTest.testId
        } item clicks`, () => {
          const { wrapper, store } = mountConnected(<CommitsActionMenu />);
          const menuItem = wrapper.getByTestId(menuTest.testId);
          fireEvent.click(menuItem);
          expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
      }
    });
  });
});
