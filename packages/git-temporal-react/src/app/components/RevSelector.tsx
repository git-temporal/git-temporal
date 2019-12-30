import React from 'react';
import { style } from 'app/styles';

import { CaretLeftIcon } from 'app/components/CaretLeftIcon';
import { CaretRightIcon } from 'app/components/CaretRightIcon';
import { Selectable } from 'app/components/Selectable';

export interface RevSelectorProps {
  // This is the text or JSX that gets wrapped in stacked label
  children: string | JSX.Element | JSX.Element[];
  onPreviousRevClick: (evt) => void;
  onNextRevClick: (evt) => void;
  style?: string | object;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

const ICON_SIZE = 16;

const defaultContainerStyle = {
  _extends: ['flexRow', 'normalText'],
  alignSelf: 'baseline',
};

const iconStyle = {
  _extends: 'flexRow',
  color: '@colors.altForeground',
  marginBottom: '5px',
};

const labelStyle = {
  _extends: 'flexColumn',
  flexGrow: 0,
  alignItems: 'center',
};

const grower = {
  flexGrow: 1,
};

export const RevSelector = (props: RevSelectorProps): JSX.Element => {
  return (
    <div style={style(defaultContainerStyle, props.style)}>
      <div style={style(grower)} />
      <Selectable style={style(iconStyle)} onClick={props.onPreviousRevClick}>
        <CaretLeftIcon height={ICON_SIZE} width={ICON_SIZE} />
      </Selectable>
      <div style={style(labelStyle)}>{props.children}</div>
      <Selectable style={style(iconStyle)} onClick={props.onNextRevClick}>
        <CaretRightIcon height={ICON_SIZE} width={ICON_SIZE} />
      </Selectable>
      <div style={style(grower)} />
    </div>
  );
};

RevSelector.displayName = 'RevSelector';
