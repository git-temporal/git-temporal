import React from 'react';
import { style } from 'app/styles';
import { ToggleButton } from 'app/components/ToggleButton';
import { Popup } from 'app/components/Popup';

export interface ActionMenuProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  isMenuOpen: boolean;
  onMenuToggle: (evt) => void;
  style?: string | object;
}

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

const buttonStyleMenuOpen = {
  _extends: buttonStyle,
  borderBottomRightRadius: '0px',
  borderBottomLeftRadius: '0px',
};

const menuStyle = {
  border: 'solid 2px @colors.selectable',
  borderTopRightRadius: '0px',
  marginRight: 0,
  minWidth: 180,
  right: '2px',
};

export const ActionMenu = (props: ActionMenuProps): JSX.Element => {
  {
    const { isMenuOpen, onMenuToggle } = props;
    const adjButtonStyle = isMenuOpen ? buttonStyleMenuOpen : buttonStyle;

    return (
      <div style={style(props.style, containerStyle)}>
        <ToggleButton
          isSelected={isMenuOpen}
          onClick={onMenuToggle}
          style={adjButtonStyle}
        >
          ...
        </ToggleButton>
        <Popup style={menuStyle} isOpen={isMenuOpen} onClose={onMenuToggle}>
          {props.children}
        </Popup>
      </div>
    );
  }
};

ActionMenu.displayName = 'ActionMenu';
