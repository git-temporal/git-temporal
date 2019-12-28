import React, { useState, ReactElement } from 'react';
import { style as s } from 'app/styles';
import { CaretRightIcon } from './CaretRightIcon';
import { CaretDownIcon } from './CaretDownIcon';

interface ComponentProps {
  children: ReactElement[];
  isOpen: boolean;
  onOpenToggle: () => void;
  style?: object;
  title: string;
}

const panelStyle = {
  _extends: 'flexColumn',
  flexGrow: 0,
  flexShrink: 0,
  position: 'relative',
};

const openPanelStyle = {
  _extends: panelStyle,
  height: 'calc(100% - 120px)',
  marginBottom: '@margins.large+px',
  transition: `all .25s ease`,
};

const closedPanelStyle = {
  ...panelStyle,
  height: 30,
  transition: `all .5s ease`,
};

const toggleIconStyle = {
  cursor: 'pointer',
};

export const CollapsibleGroup: React.FC<ComponentProps> = ({
  children,
  style,
  title,
  isOpen,
  onOpenToggle,
}): React.ReactElement => {
  const panelStyle = isOpen ? openPanelStyle : closedPanelStyle;
  return (
    <div style={s(panelStyle, style)} onClick={onOpenToggle}>
      <div style={s('flexRow')}>
        <div style={s(toggleIconStyle)}>
          {isOpen ? <CaretDownIcon /> : <CaretRightIcon />}
        </div>
        <div style={s('h2Text')}>{title}</div>
      </div>
      {isOpen && children}
    </div>
  );
};
