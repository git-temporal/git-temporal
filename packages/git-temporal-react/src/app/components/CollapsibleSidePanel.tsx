import React, { useState, ReactElement } from 'react';
import { delay } from 'lodash';
import { style as s } from 'app/styles';

interface ComponentProps {
  children: ReactElement | ReactElement[];
  style: object;
  onOpen?: () => void;
  onClose?: () => void;
}

const openDelaySeconds = 0.25;
const closeDelaySeconds = 0.5;

const openPanelStyle = {
  _extends: ['flexColumn'],
  position: 'relative',
  flexShrink: 0,
  width: 300,
  transition: `all ${openDelaySeconds}s ease`,
};

const closedPanelStyle = {
  _extends: ['flexColumn'],
  position: 'relative',
  width: 20,
  transition: `all ${closeDelaySeconds}s ease`,
};

const toggleIconStyle = {
  position: 'absolute',
  right: '@margins.medium+px',
  top: '@margins.medium+px',
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
      onClose && delay(() => onClose(), closeDelaySeconds * 1000);
    } else {
      onOpen && delay(() => onOpen(), openDelaySeconds * 1000);
    }
    setIsOpen(!isOpen);
  }
};
