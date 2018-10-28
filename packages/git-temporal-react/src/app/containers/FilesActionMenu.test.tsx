import React from 'react';
import { shallow } from 'enzyme';
import * as actions from 'app/actions';
import { FilesContainerSorts } from 'app/actions/ActionTypes';

import { FilesActionMenu } from './FilesActionMenu';

const basicProps = {
  filesContainerSort: FilesContainerSorts.TIME,
};

describe('containers/FilesActionMenu', () => {
  describe('when rendered with basic props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <FilesActionMenu dispatch={mockDispatch} {...basicProps} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
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
          wrapper.find({ testId: menuTest.testId }).simulate('click');
          expect(menuTest.actionFn).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledTimes(1);
        });
      }
    });
  });
});
