import React from 'react';
import { shallow } from 'enzyme';

import { Popup } from './Popup';

describe('components/Popup', () => {
  describe('when rendered with isOpen=true)', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <Popup isOpen={true} onClose={jest.fn()}>
          This is some popup content, yo.
        </Popup>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
