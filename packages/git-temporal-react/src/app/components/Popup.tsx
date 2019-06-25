import React from 'react';
import { style } from 'app/styles';

export interface PopupProps {
  isOpen: boolean;
  // The children are the popup content
  children: string | JSX.Element | JSX.Element[];
  onClose?: (evt) => void;
  onMouseEnter?: (evt) => void;
  onMouseLeave?: (evt) => void;
  style?: string | object;
  noBackdrop?: boolean;
}

const containerStyle = {
  overflow: 'visible',
};

const popupStyle = {
  _extends: 'popup',
  right: 0,
  marginRight: 0,
  minWidth: 180,
  zIndex: 4,
};

const backdropStyle = {
  opacity: 0,
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  zIndex: 3,
};

const visible = { display: 'block' };
const hidden = { display: 'none' };

export class Popup extends React.Component<PopupProps> {
  render() {
    const popupStyles: any = [popupStyle, this.props.style];
    const backdropStyles: any = [backdropStyle];
    if (this.props.isOpen) {
      popupStyles.push(visible);
      backdropStyles.push(visible);
    } else {
      popupStyles.push(hidden);
      backdropStyles.push(hidden);
    }

    return (
      <div style={style(containerStyle)}>
        {!this.props.noBackdrop && (
          <div style={style(backdropStyles)} onClick={this.onBackdropClick} />
        )}
        <div
          style={style(popupStyles)}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

  onBackdropClick = (evt: any) => {
    this.props.onClose && this.props.onClose(evt);
  };

  onMouseEnter = (evt: any) => {
    this.props.onMouseEnter && this.props.onMouseEnter(evt);
  };

  onMouseLeave = (evt: any) => {
    this.props.onMouseLeave && this.props.onMouseLeave(evt);
  };
}
