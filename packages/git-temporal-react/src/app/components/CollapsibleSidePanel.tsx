import React, { useState, ReactElement } from 'react';
import { style as s } from 'app/styles';

interface ComponentProps {
  children: ReactElement[];
  style: object;
  onOpen?: () => void;
  onClose?: () => void;
}

const openPanelStyle = {
  _extends: ['flexColumns'],
  position: 'relative',
  width: 300,
};

const closedPanelStyle = {
  _extends: ['flexColumns'],
  position: 'relative',
  width: 30,
};

const toggleIconStyle = {
  position: 'absolute',
  right: '@margins.medium',
  top: '@margins.medium',
  cursor: 'pointer',
  zIndex: 1,
};

export const CollapsibleSidePanel: React.FC<ComponentProps> = ({
  children,
  style,
  onOpen,
  onClose,
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const panelStyle = isOpen ? openPanelStyle : closedPanelStyle;
  return (
    <div style={s(panelStyle, style)} onClick={didClickPanel}>
      <div style={s(toggleIconStyle)} onClick={didToggle}>
        |||
      </div>
      {isOpen && children}
    </div>
  );

  function didClickPanel() {
    !isOpen && didToggle();
  }

  function didToggle() {
    if (isOpen) {
      onClose && onClose();
    } else {
      onOpen && onOpen();
    }
    setIsOpen(!isOpen);
  }
};
