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

const menuStyle = {
  right: 0,
  marginRight: 0,
  minWidth: 180,
};

export const ActionMenu = (props: ActionMenuProps): JSX.Element => {
  {
    const { isMenuOpen, onMenuToggle } = props;

    return (
      <div style={style(props.style, containerStyle)}>
        <ToggleButton
          isSelected={isMenuOpen}
          onClick={onMenuToggle}
          style={buttonStyle}
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
