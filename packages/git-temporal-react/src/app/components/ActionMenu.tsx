import React from 'react';
import { style } from 'app/styles';
import { ToggleButton } from 'app/components/ToggleButton';

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

export class ActionMenu extends React.Component<
  ActionMenuProps,
  ActionMenuState
> {
  readonly state: ActionMenuState = initialState;

  render() {
    const menuStyles: any = [menuStyle];
    const backdropStyles: any = [backdropStyle];
    if (this.state.menuOpen) {
      menuStyles.push(visible);
      backdropStyles.push(visible);
    } else {
      menuStyles.push(hidden);
      backdropStyles.push(hidden);
    }

    return (
      <div style={style(this.props.style, containerStyle)}>
        <ToggleButton
          isSelected={this.state.menuOpen}
          onClick={this.onToggleClick}
          style={buttonStyle}
        >
          ...
        </ToggleButton>
        <div style={style(backdropStyles)} onClick={this.onBackdropClick} />
        <div style={style(menuStyles)} onClick={this.onToggleClick}>
          {this.props.children}
        </div>
      </div>
    );
  }

  onToggleClick = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };
  onBackdropClick = () => {
    this.setState({ menuOpen: false });
  };
}
