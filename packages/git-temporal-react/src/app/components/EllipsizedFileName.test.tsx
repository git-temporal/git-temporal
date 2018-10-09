import React from 'react';
import { shallow } from 'enzyme';

import { EllipsizedFileName } from './EllipsizedFileName';

describe('components/EllipsizedFileName', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <EllipsizedFileName
          fileName="some/really/long/path/and/fileName.txt"
          maxCharacters={5}
        />
      );
    });

    test('it should have shortened the fileName without removing first and last parts)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
