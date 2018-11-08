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
  onScroll: (scrollLeft: number) => void;
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
  bottom: -19,
  backgroundColor: style('backgroundColor')['backgroundColor'],
};

const availableZooms = [100, 200, 300, 500, 800, 1300];

export class ZoomContainer extends React.Component<
  ZoomContainerProps,
  ZoomContainerState
> {
  readonly state: ZoomContainerState = initialState;

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.zoom !== this.state.zoom) {
      this.props.onZoom(this.state.zoom);
    }
  }

  render() {
    const zoomStyle = {
      width: `${this.state.zoom || 100}%`,
    };
    return (
      <div
        style={style(this.props.style, outerStyle)}
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
        <div style={style(zoomSelectorStyle)}>
          <label style={style('normalText')}>
            <select onChange={this.onZoomChange}>
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
      const selected = value === this.state.zoom;
      return (
        <option key={index} value={value} selected={selected}>
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
