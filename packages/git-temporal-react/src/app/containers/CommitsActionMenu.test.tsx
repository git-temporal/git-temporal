import React from 'react';
import { shallow } from 'enzyme';
import * as actions from 'app/actions';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

import { CommitsActionMenu } from './CommitsActionMenu';

const basicProps = {
  commitsContainerSort: CommitsContainerSorts.TIME,
};

describe('containers/CommitsActionMenu', () => {
  describe('when rendered with basic props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <CommitsActionMenu dispatch={mockDispatch} {...basicProps} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('...and then clicking menu items', () => {
      const menusToTest = [
        {
          testId: 'sortTime',
          actionFn: actions.setCommitsContainerSort,
        },
        {
          testId: 'sortLines',
          actionFn: actions.setCommitsContainerSort,
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
