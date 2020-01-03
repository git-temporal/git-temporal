import React from 'react';
import { style } from 'app/styles';

import { SpinnerImage } from 'app/components/SpinnerImage';

export interface SpinnerContainerProps {
  isSpinning: boolean;
  children: string | JSX.Element | JSX.Element[];
  spinnerImageSize?: number;
  opaque?: boolean;
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
  const { isSpinning, opaque, spinnerImageSize } = props;
  return (
    <div style={style(containerStyle, props.style)}>
      {renderSpinner(isSpinning, opaque, spinnerImageSize)}
      {!(isSpinning && opaque) && props.children}
    </div>
  );
};

const renderSpinner = (
  isSpinning: boolean,
  opaque: boolean,
  spinnerImageSize: number
) => {
  if (!isSpinning) {
    return null;
  }
  const s = backdropStyle;
  if (opaque) {
    s.opacity = 1;
  }
  return (
    <div style={style(backdropStyle)}>
      <SpinnerImage width={spinnerImageSize} height={spinnerImageSize} />
    </div>
  );
};
