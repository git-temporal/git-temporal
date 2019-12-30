import React from 'react';
import { style } from 'app/styles';

import { SpinnerImage } from 'app/components/SpinnerImage';

export interface SpinnerContainerProps {
  isSpinning: boolean;
  children: string | JSX.Element | JSX.Element[];
  style?: string | object;
}

const containerStyle = {
  display: 'block',
  height: '100%',
  width: '100%',
  position: 'relative',
};

const backdropStyle = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  zIndex: '5',
  backgroundColor: '@colors.background',
  opacity: 0.9,
};

export const SpinnerContainer = (props: SpinnerContainerProps): JSX.Element => {
  return (
    <div style={style(containerStyle, props.style)}>
      {renderSpinner(props.isSpinning)}
      {props.children}
    </div>
  );
};

const renderSpinner = (isSpinning: boolean) => {
  if (!isSpinning) {
    return null;
  }
  return (
    <div style={style(backdropStyle)}>
      <SpinnerImage />
    </div>
  );
};
