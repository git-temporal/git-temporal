import React from 'react';
import { style } from 'app/styles';

import { HorizontalScroller } from 'app/components/HorizontalScroller';

export interface ICustomZoom {
  label: string;
  value: number;
}

export interface ZoomContainerProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  scrollLeft?: number;
  customZooms?: ICustomZoom[];
  onZoom?: (value: number) => void;
  onMouseEnter?: (evt: object) => void;
  onMouseLeave?: (evt: object) => void;
  onScroll?: (scrollLeft: number) => void;
  // applied to the selector only
  style?: string | object;
}

const initialState = {
  zoom: 100,
};

type ZoomContainerState = Readonly<typeof initialState>;

const outerStyle = {
  _extends: 'fill',
  position: 'relative',
};

const scrollContainerStyle = {
  height: '100%',
  // width: is computed based on state.zoom
};

const zoomSelectorStyle = {
  position: 'absolute',
  right: 18,
  background: 'transparent',
};

const availableZooms = [100, 200, 300, 500, 800, 1300];

export class ZoomContainer extends React.Component<
  ZoomContainerProps,
  ZoomContainerState
> {
  readonly state: ZoomContainerState = initialState;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.zoom !== this.state.zoom && this.props.onZoom) {
      this.props.onZoom(this.state.zoom);
    }
    const prevCustomZooms =
      (prevProps.customZooms && prevProps.customZooms.length) || 0;
    const currCustomZooms =
      (this.props.customZooms && this.props.customZooms.length) || 0;
    // if we are set to a custom zoom and custom zooms changed...
    if (prevCustomZooms !== currCustomZooms) {
      this.setState({ zoom: initialState.zoom });
    }
  }

  render() {
    const zoomStyle = {
      width: `${this.state.zoom || 100}%`,
    };
    return (
      <div
        style={style(outerStyle)}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <HorizontalScroller
          onScroll={this.props.onScroll}
          scrollLeft={this.props.scrollLeft}
        >
          <div style={style(scrollContainerStyle, zoomStyle)}>
            {this.props.children}
          </div>
        </HorizontalScroller>
        <div style={style(zoomSelectorStyle, this.props.style)}>
          <label style={style('normalText')}>
            <select onChange={this.onZoomChange} value={this.state.zoom}>
              {this.renderZoomOptions()}
            </select>
          </label>
        </div>
      </div>
    );
  }

  private renderZoomOptions(): any {
    const customZooms = this.props.customZooms || [];
    const standardZooms = availableZooms.map(zoom => ({
      value: zoom,
      label: `${zoom}% zoom`,
    }));
    return customZooms.concat(standardZooms).map(({ value, label }, index) => {
      return (
        <option key={index} value={value}>
          {label}
        </option>
      );
    });
  }

  private onZoomChange = evt => {
    const value = parseInt(evt.target.value, 10);
    this.setState({ zoom: value });
  };
}
