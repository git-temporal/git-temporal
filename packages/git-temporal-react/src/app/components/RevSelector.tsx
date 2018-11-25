import React from 'react';
import { style } from 'app/styles';

import { CaretLeftIcon } from 'app/components/CaretLeftIcon';
import { CaretRightIcon } from 'app/components/CaretRightIcon';

export interface RevSelectorProps {
  // This is the text or JSX that gets wrapped in stacked label
  children: string | JSX.Element | JSX.Element[];
  onPreviousRevClick?: (evt) => void;
  onNextRevClick?: (evt) => void;
  style?: string | object;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

const ICON_SIZE = 28;

const defaultContainerStyle = {
  _extends: ['inline', 'h2Text'],
  marginRight: 20,
  marginBottom: 10,
  fontWeight: 'normal',
};

const labelStyle = {
  _extends: 'inline',
  verticalAlign: 'super',
};

export const RevSelector = (props: RevSelectorProps): JSX.Element => {
  return (
    <div style={style(defaultContainerStyle, props.style)}>
      <CaretLeftIcon style="inline" height={ICON_SIZE} width={ICON_SIZE} />
      <div style={style(labelStyle)}>{props.children}</div>
      <CaretRightIcon style="inline" height={ICON_SIZE} width={ICON_SIZE} />
    </div>
  );
};

RevSelector.displayName = 'RevSelector';
