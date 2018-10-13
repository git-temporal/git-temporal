import React from 'react';
import { shallow } from 'enzyme';

import { AddedDeleted } from './AddedDeleted';

describe('components/AddedDeleted', () => {
  describe('when rendered epoch time 1539369263 (Fri, 12 Oct 2018 18:34:23 GMT)', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <AddedDeleted linesAdded={20034} linesDeleted={9877349} />
      );
    });

    test('it should match snapshot (it should have rendered linesAdded and linesDeleted with commas)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
