import React from 'react';
import { style } from 'app/styles';

export interface ZoomContainerProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  onZoom?: (value: number) => void;
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

const containerStyle = {
  overflowX: 'scroll',
  height: '100%',
  width: '100%',
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

  render() {
    const zoomStyle = {
      width: `${this.state.zoom || 100}%`,
    };
    return (
      <div style={style(outerStyle)}>
        <div style={style(this.props.style, containerStyle)}>
          <div style={style(scrollContainerStyle, zoomStyle)}>
            {this.props.children}
          </div>
        </div>
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
    return availableZooms.map((zoom, index) => {
      const selected = zoom === this.state.zoom;
      return (
        <option key={index} value={zoom} selected={selected}>
          {zoom}% zoom
        </option>
      );
    });
  }

  private onZoomChange = evt => {
    const value = parseInt(evt.target.value, 10);
    this.setState({ zoom: value }, () => {
      this.props.onZoom(value);
    });
  };
}
