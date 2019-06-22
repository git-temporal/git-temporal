import React, { useState, ReactElement } from 'react';
import { style as s } from 'app/styles';
import { CaretRightIcon } from './CaretRightIcon';
import { CaretDownIcon } from './CaretDownIcon';

interface ComponentProps {
  children: ReactElement[];
  title: string;
  style?: object;
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
  marginBottom: '@margins.large',
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
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const panelStyle = isOpen ? openPanelStyle : closedPanelStyle;
  return (
    <div style={s(panelStyle, style)} onClick={didClickPanel}>
      <div style={s('flexRow')}>
        <div style={s(toggleIconStyle)} onClick={didToggle}>
          {isOpen ? <CaretDownIcon /> : <CaretRightIcon />}
        </div>
        <div style={s('h2Text')}>{title}</div>
      </div>
      {isOpen && children}
    </div>
  );

  function didClickPanel() {
    !isOpen && didToggle();
  }

  function didToggle() {
    setIsOpen(!isOpen);
  }
};
