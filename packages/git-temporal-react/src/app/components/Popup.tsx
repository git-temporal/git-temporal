import React from 'react';
import { style } from 'app/styles';

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  // The children are the popup content
  children: string | JSX.Element | JSX.Element[];
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
          <div style={style(backdropStyles)} onClick={this.onClose} />
        )}
        <div style={style(popupStyles)} onClick={this.onClose}>
          {this.props.children}
        </div>
      </div>
    );
  }

  onClose = () => {
    this.props.onClose();
  };
}
