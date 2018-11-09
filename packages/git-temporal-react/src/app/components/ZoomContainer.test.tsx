import React from 'react';
import { shallow } from 'enzyme';

import { ZoomContainer } from './ZoomContainer';

describe('components/ZoomContainer', () => {
  describe('when rendered', () => {
    let wrapper;
    const onZoomMock = jest.fn();
    beforeAll(() => {
      wrapper = shallow(
        <ZoomContainer onZoom={onZoomMock}>
          <div style={{ width: '100%' }}>
            This is something contained in a ZoomContainer
          </div>
        </ZoomContainer>
      );
    });

    test('it should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing zoom prop', () => {
      wrapper.instance().onZoomChange({ target: { value: '400' } });
      expect(onZoomMock).toHaveBeenCalledTimes(1);
    });
  });
});
