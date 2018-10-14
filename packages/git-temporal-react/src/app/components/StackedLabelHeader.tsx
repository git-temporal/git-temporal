import React from 'react';

import { StackedLabel, StackedLabelProps } from './StackedLabel';
import { style } from 'app/styles';

const localStyles = {
  labelStyle: {
    _extends: 'h3Text',
    marginBottom: 5,
  },
  textStyle: {
    _extends: 'h2Text',
  },
};

export const StackedLabelHeader = (props: StackedLabelProps): JSX.Element => {
  const propsForward = Object.assign({}, props, {
    labelStyle: [localStyles.labelStyle, props.labelStyle],
  });

  return (
    <StackedLabel {...propsForward}>
      <div style={style(localStyles.textStyle)}>{props.children}</div>
    </StackedLabel>
  );
};
