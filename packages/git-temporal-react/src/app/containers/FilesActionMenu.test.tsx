import React from 'react';
import * as actions from 'app/actions';
import FilesActionMenu from './FilesActionMenu';

import { fireEvent } from '@testing-library/react';
import { mountConnected } from 'testHelpers';

describe('containers/FilesActionMenu', () => {
  describe('when rendered with mock redux store', () => {
    test('it should match snapshot', () => {
      const { wrapper } = mountConnected(<FilesActionMenu />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    describe('...and then clicking menu items', () => {
      const menusToTest = [
        {
          testId: 'sortTime',
          actionFn: actions.setFilesContainerSort,
        },
        {
          testId: 'sortCommits',
          actionFn: actions.setFilesContainerSort,
        },
        {
          testId: 'sortLines',
          actionFn: actions.setFilesContainerSort,
        },
      ];
      beforeEach(() => {
        jest.clearAllMocks();
      });
      for (const menuTest of menusToTest) {
        test(`it should call actions in response to ${
          menuTest.testId
        } item clicks`, () => {
          const { wrapper, store } = mountConnected(<FilesActionMenu />);
          const menuItem = wrapper.getByTestId(menuTest.testId);
          fireEvent.click(menuItem);
          expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
      }
    });
  });
});
