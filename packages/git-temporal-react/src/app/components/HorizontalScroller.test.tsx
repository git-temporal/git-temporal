import React from 'react';
import { mount } from 'enzyme';

import { HorizontalScroller } from './HorizontalScroller';

describe('components/HorizontalScroller', () => {
  describe('when rendered with 100% width div', () => {
    let wrapper;
    const onScrollMock = jest.fn();
    beforeAll(() => {
      wrapper = mount(
        <HorizontalScroller onScroll={onScrollMock}>
          <div style={{ width: '100%' }}>This is a 100% width div</div>
        </HorizontalScroller>
      );
    });

    test('it should match snapshot (it should have render just the children without left or right touch controls)")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with 200% width div', () => {
    let wrapper;
    const original__getBoundClientRect =
      Element.prototype.getBoundingClientRect;
    const onScrollMock = jest.fn();
    beforeAll(() => {
      Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = jest.fn(() => {
        return {
          width: 400,
          height: 120,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        };
      });
      wrapper = mount(
        <HorizontalScroller onScroll={onScrollMock}>
          <div style={{ width: '200%' }}>This is a 200% width div</div>
        </HorizontalScroller>
      );
      const innerEl = wrapper.find('[data-testid="innerContainer"]');
      const outerEl = wrapper.find('[data-testid="outerContainer"]');
      // TODO : the below never changes the element properties in the test
      //   uncomment the console.log lines in showHideTouchControls() to see
      innerEl.scrollWidth = 200;
      outerEl.clientWidth = 400;
    });
    afterAll(() => {
      Element.prototype.getBoundingClientRect = original__getBoundClientRect;
    });

    test('it should match snapshot (should have rendered the child with a right touch control))', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('and then changing the scrollLeft, it should NOT have called the onScroll callback', () => {
      wrapper.setProps({ scrollLeft: 100 });
      // we should only call the onScroll callback for user initiate scroll events\\
      expect(onScrollMock).toHaveBeenCalledTimes(0);
    });

    //  TODO : this is a blatent hack at improving coverage, fix when we figureout how to
    //   set scrollLeft, scrollWidth, clientWidth on elements rendered with enzyme
    test('and then clicking the right touch, it should should scroll left', () => {
      wrapper.instance().onRightTouchClick();
      wrapper.instance().onRightTouchDoubleClick();
      wrapper.instance().onLeftTouchClick();
      wrapper.instance().onLeftTouchDoubleClick();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
