import React from 'react';
import * as actions from 'app/actions';
import AuthorsActionMenu from './AuthorsActionMenu';

import { fireEvent } from '@testing-library/react';
import { mountConnected } from 'testHelpers';

describe('containers/AuthorsActionMenu', () => {
  describe('when rendered with mock redux store', () => {
    test('it should match snapshot', () => {
      const { wrapper } = mountConnected(<AuthorsActionMenu />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    describe('...and then clicking menu items', () => {
      const menusToTest = [
        {
          testId: 'sortTime',
          actionFn: actions.setAuthorsContainerSort,
        },
        {
          testId: 'sortCommits',
          actionFn: actions.setAuthorsContainerSort,
        },
        {
          testId: 'sortLines',
          actionFn: actions.setAuthorsContainerSort,
        },
      ];
      beforeEach(() => {
        jest.clearAllMocks();
      });
      for (const menuTest of menusToTest) {
        test(`it should call actions in response to ${
          menuTest.testId
        } item clicks`, () => {
          const { wrapper, store } = mountConnected(<AuthorsActionMenu />);
          const menuItem = wrapper.getByTestId(menuTest.testId);
          fireEvent.click(menuItem);
          expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
      }
    });
  });
});
