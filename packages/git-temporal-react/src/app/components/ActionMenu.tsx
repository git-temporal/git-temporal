import React from 'react';
import { style } from 'app/styles';
import { ToggleButton } from 'app/components/ToggleButton';
import { Popup } from 'app/components/Popup';

export interface ActionMenuProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  style?: string | object;
}
const initialState = {
  menuOpen: false,
};
type ActionMenuState = Readonly<typeof initialState>;

const containerStyle = {
  overflow: 'visible',
  height: 16,
  width: 28,
};

const buttonStyle = {
  _extends: 'h2Text',
  height: 29,
  width: 14,
  margin: 0,
  padding: '0px 5px',
};

const menuStyle = {
  right: 0,
  marginRight: 0,
  minWidth: 180,
};

export class ActionMenu extends React.Component<
  ActionMenuProps,
  ActionMenuState
> {
  readonly state: ActionMenuState = initialState;

  render() {
    return (
      <div style={style(this.props.style, containerStyle)}>
        <ToggleButton
          isSelected={this.state.menuOpen}
          onClick={this.onToggleClick}
          style={buttonStyle}
        >
          ...
        </ToggleButton>
        <Popup
          style={menuStyle}
          isOpen={this.state.menuOpen}
          onClose={this.onPopupClose}
        >
          {this.props.children}
        </Popup>
      </div>
    );
  }

  onToggleClick = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };
  onPopupClose = () => {
    this.setState({ menuOpen: false });
  };
}
