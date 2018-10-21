import React from 'react';
import { shallow } from 'enzyme';
import * as actions from 'app/actions';
import {
  AuthorsContainerFilters,
  AuthorsContainerSorts,
} from 'app/actions/ActionTypes';

import { AuthorsActionMenu } from './AuthorsActionMenu';

const basicProps = {
  authorsContainerFilter: AuthorsContainerFilters.ALL,
  authorsContainerSort: AuthorsContainerSorts.TIME,
  filteredAuthors: [],
};

const authorsFilterWithoutFilteredAuthors = {
  authorsContainerFilter: AuthorsContainerFilters.FILTERED,
  authorsContainerSort: AuthorsContainerSorts.TIME,
  filteredAuthors: [],
};

const withFilteredAuthorsAndAuthorsContainerFiltered = {
  authorsContainerFilter: AuthorsContainerFilters.FILTERED,
  authorsContainerSort: AuthorsContainerSorts.TIME,
  filteredAuthors: ['Zaphod Beeblebrox', 'Arthur Dent'],
};

const expectDisabledItems = (wrapper, value) => {
  expect(wrapper.find('[testId="filteredAuthors"]').prop('disabled')).toBe(
    value
  );
  expect(
    wrapper.find('[testId="removeAllAuthorFilters"]').prop('disabled')
  ).toBe(value);
};

describe('containers/AuthorsActionMenu', () => {
  describe('when rendered with basic props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <AuthorsActionMenu dispatch={mockDispatch} {...basicProps} />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should NOT have dispatched actions.setAuthorsContainerFilter', () => {
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(actions.setAuthorsContainerFilter).toHaveBeenCalledTimes(0);
    });
  });
  describe('when rendered with authorsFilterWithoutFilteredAuthors', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <AuthorsActionMenu
          dispatch={mockDispatch}
          {...authorsFilterWithoutFilteredAuthors}
        />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('it should have dispatched actions.setAuthorsContainerFilter', () => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(actions.setAuthorsContainerFilter).toHaveBeenCalledTimes(1);
    });

    test('it should have disabled filteredAuthors and removeAllAuthorFilters', () => {
      expectDisabledItems(wrapper, true);
    });
  });

  describe('when rendered with filteredAuthors and authorsContainerFilter=FILTERED', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      mockDispatch = jest.fn();
      wrapper = shallow(
        <AuthorsActionMenu
          dispatch={mockDispatch}
          {...withFilteredAuthorsAndAuthorsContainerFiltered}
        />
      );
    });
    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
    test('it should NOT have disabled filteredAuthors and removeAllAuthorFilters', () => {
      expectDisabledItems(wrapper, false);
    });

    describe('...and then clicking menu items', () => {
      const menusToTest = [
        {
          testId: 'allAuthors',
          actionFn: actions.setAuthorsContainerFilter,
        },
        {
          testId: 'filteredAuthors',
          actionFn: actions.setAuthorsContainerFilter,
        },
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
        {
          testId: 'removeAllAuthorFilters',
          actionFn: actions.removeAllAuthorFilters,
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
