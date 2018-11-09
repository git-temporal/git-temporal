import React from 'react';
import { shallow } from 'enzyme';

import { CommitBody } from './CommitBody';

const testText =
  'each<br><br>line<br><br>should<br><br>be<br><br>in a span<br><br>';

describe('components/CommitBody', () => {
  describe('when rendered with text containing <br>s', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommitBody text={testText} />);
    });

    test('it should match snapshot (it should have rendered a block element for each line with <br><br>")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
