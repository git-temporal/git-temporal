import React from 'react';
import { shallow } from 'enzyme';
import { GitTemporal } from './GitTemporal';

const dispatchMock = jest.fn();

describe('components/GitTemporal', () => {
  test('it should match snapshot', () => {
    const wrapper = shallow(<GitTemporal dispatch={dispatchMock} />);
    expect(wrapper).toMatchSnapshot();
  });
});
