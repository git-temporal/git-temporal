import React from 'react';
import { shallow } from 'enzyme';

import { SearchInput } from './SearchInput';

describe('components/SearchInput', () => {
  describe('when rendered with value', () => {
    let wrapper;
    const onChangeMock = jest.fn();
    const onClearMock = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <SearchInput
          value={'test value'}
          onChange={onChangeMock}
          onClear={onClearMock}
        />
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing input, should call onChange', done => {
      const event = {
        preventDefault() {},
        target: { value: 'the-value' },
      };
      wrapper.find('input').simulate('change', event);
      // the component should debounce the input and change callback
      expect(onChangeMock).toHaveBeenCalledTimes(0);
      setTimeout(() => {
        expect(onChangeMock).toBeCalledWith('the-value');
        done();
      }, 1000);
    });
  });
});
