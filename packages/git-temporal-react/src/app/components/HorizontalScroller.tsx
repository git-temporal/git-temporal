import React from 'react';
import { style } from 'app/styles';
import { relative } from 'path';
import { debounce } from 'app/utilities/debounce';

export interface HorizontalScrollerProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  style?: string | object;
}

const initialState = {
  showingLeftTouch: true,
  showingRightTouch: true,
};

type HorizontalScrollerState = Readonly<typeof initialState>;

const outerStyle = {
  _extends: 'fill',
  overflowX: 'scroll',
  position: relative,
};

const innerContainerStyle = {
  position: 'relative',
  display: 'block',
};

const touchArea = {
  position: 'absolute',
  top: 0,
  width: 0,
  height: 0,
  zIndex: 1,
  marginTop: 5,
};

const leftTouchStyle = {
  _extends: touchArea,
  borderTop: '60px solid transparent',
  borderBottom: '60px solid transparent',
  borderRight: '20px solid rgba(96, 96, 96, .6)',
};

const rightTouchStyle = {
  _extends: touchArea,
  right: 0,
  borderTop: '60px solid transparent',
  borderBottom: '60px solid transparent',
  borderLeft: '20px solid rgba(96, 96, 96, .6)',
};

export class HorizontalScroller extends React.Component<
  HorizontalScrollerProps,
  HorizontalScrollerState
> {
  readonly state: HorizontalScrollerState = initialState;
  private innerContainerRef;
  private outerContainerRef;
  private debouncedOnScroll;

  constructor(props) {
    super(props);
    this.innerContainerRef = React.createRef();
    this.outerContainerRef = React.createRef();

    this.onScroll = this.onScroll.bind(this);
    this.debouncedOnScroll = debounce(this.onScroll, 50);
  }

  componentDidMount() {
    this.showHideTouchControls();
  }

  componentDidUpdate() {
    this.showHideTouchControls();
  }

  render() {
    return (
      <div
        style={style(outerStyle, this.props.style)}
        ref={this.outerContainerRef}
        onScroll={this.debouncedOnScroll}
      >
        <div style={style(innerContainerStyle)} ref={this.innerContainerRef}>
          {this.props.children}
        </div>
        {this.state.showingLeftTouch && (
          <div
            style={style(leftTouchStyle)}
            onClick={this.onLeftTouchClick}
            onDoubleClick={this.onLeftTouchDoubleClick}
          />
        )}
        {this.state.showingRightTouch && (
          <div
            style={style(rightTouchStyle)}
            onClick={this.onRightTouchClick}
            onDoubleClick={this.onRightTouchDoubleClick}
          />
        )}
      </div>
    );
  }

  private showHideTouchControls() {
    const innerEl = this.innerContainerRef.current;
    const outerEl = this.outerContainerRef.current;

    const innerBoundingRect = innerEl.getBoundingClientRect();
    const showingLeftTouch = outerEl.scrollLeft > 0;
    const showingRightTouch =
      innerEl.scrollWidth > outerEl.clientWidth &&
      outerEl.scrollLeft + innerBoundingRect.width < innerEl.scrollWidth;
    const shouldUpdate =
      showingLeftTouch !== this.state.showingLeftTouch ||
      showingRightTouch !== this.state.showingRightTouch;
    if (shouldUpdate) {
      this.setState({ showingLeftTouch, showingRightTouch });
    }
  }

  private onScroll() {
    this.showHideTouchControls();
  }

  private onLeftTouchClick = () => {
    const innerEl = this.innerContainerRef.current;
    const outerEl = this.outerContainerRef.current;
    const innerBoundingRect = innerEl.getBoundingClientRect();

    let newScrollLeft = outerEl.scrollLeft - innerBoundingRect.width + 50;
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }
    outerEl.scrollLeft = newScrollLeft;
  };

  private onLeftTouchDoubleClick = () => {
    const outerEl = this.outerContainerRef.current;
    outerEl.scrollLeft = 0;
  };

  private onRightTouchClick = () => {
    const innerEl = this.innerContainerRef.current;
    const outerEl = this.outerContainerRef.current;
    const innerBoundingRect = innerEl.getBoundingClientRect();
    const maxScrollLeft = innerEl.scrollWidth - innerBoundingRect.width;

    let newScrollLeft = outerEl.scrollLeft + innerBoundingRect.width - 50;
    if (newScrollLeft > maxScrollLeft) {
      newScrollLeft = maxScrollLeft;
    }
    outerEl.scrollLeft = newScrollLeft;
  };

  private onRightTouchDoubleClick = () => {
    const innerEl = this.innerContainerRef.current;
    const outerEl = this.outerContainerRef.current;
    const innerBoundingRect = innerEl.getBoundingClientRect();
    const maxScrollLeft = innerEl.scrollWidth - innerBoundingRect.width;

    outerEl.scrollLeft = maxScrollLeft;
  };
}

//   render(initialScrollLeft) {
//     if (initialScrollLeft == null) { initialScrollLeft = 0; }
//     this.initialScrollLeft = initialScrollLeft;
//     this._toggleTouchAreas();
//     this.$element.scrollLeft(this.initialScrollLeft);
//     return this.$element;
//   }

//   scrollFarRight() {
//     return this.$element.scrollLeft(this._getChildWidth() - this.$element.width());
//   }

//   scrollFarLeft() {
//     return this.$element.scrollLeft(0);
//   }

//   getScrollLeft() {
//     return this.$element.scrollLeft();
//   }

//   getScrollRight() {
//     return this.$element.scrollLeft() + this.$element.width();
//   }

//   _onScroll() {
//     return this._toggleTouchAreas();
//   }

//   _onTouchClick(which) {
//     switch (which) {
//       case "left": return this.scrollFarLeft();
//       case "right": return this.scrollFarRight();
//     }
//   }

//   _toggleTouchAreas() {
//     this._toggleTouchArea('left');
//     return this._toggleTouchArea('right');
//   }

//   _toggleTouchArea(which) {
//     let $touchArea = this.$element.find(`.gtm-touch-area.gtm-${which}`);
//     if (!($touchArea.length > 0)) {
//       $touchArea = $(`<div class='gtm-touch-area gtm-${which}'>`);
//       $touchArea.on("click.gtmTouchArea", () => this._onTouchClick(which));
//       this.$element.prepend($touchArea);
//     }

//     const scrollLeft = this.getScrollLeft();
//     const relativeRight = this.getScrollRight();

//     const { shouldHide, areaLeft } = (() => {
//       switch (which) {
//         case 'left':
//           return {
//             shouldHide: scrollLeft === 0,
//             areaLeft: scrollLeft
//           };
//         case 'right':
//           return {
//             shouldHide: relativeRight >= (this._getChildWidth() - 10),
//             areaLeft: relativeRight - 20
//           };
//       }
//     })();

//     if (shouldHide) {
//       return $touchArea.hide();
//     } else {
//       $touchArea.css({ left: areaLeft });
//       return $touchArea.show();
//     }
//   }

//   _getChildWidth() {
//     return this.$element.find('.timeplot').outerWidth(true);
//   }
// };
