import React from 'react';
import { shallow } from 'enzyme';
import { selectPath } from 'app/actions';

import { Header } from './Header';

const testAuthors = ['Author One', 'Author Two', 'Author Three'];

describe('containers/Header', () => {
  describe('when rendered without props', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(<Header dispatch={mockDispatch} selectedPath="" />);
    });

    test('it should match snapshot (it should be showing App Name and repository:/)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with a proper path', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(
        <Header dispatch={mockDispatch} selectedPath="some/path/to/File.txt" />
      );
    });

    test('it should match snapshot (it should have path links for all but last part of path)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with filteredAuthors', () => {
    let wrapper;
    let mockDispatch;
    beforeAll(() => {
      // @ts-ignore
      selectPath.mockClear();
      mockDispatch = jest.fn();
      wrapper = shallow(
        <Header dispatch={mockDispatch} filteredAuthors={testAuthors} />
      );
    });

    test('it should match snapshot (it should have path links for all but last part of path)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
