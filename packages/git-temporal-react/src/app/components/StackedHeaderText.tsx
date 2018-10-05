import React from 'react';

import { StackedLabelText, StackedLabelTextProps } from './StackedLabelText';

const localStyles = {
  labelStyle: {
    _extends: 'h3Text',
    marginBottom: 5,
  },
  textStyle: {
    _extends: 'h2Text',
  },
};

export const StackedHeaderText = (
  props: StackedLabelTextProps
): JSX.Element => {
  const propsForward = Object.assign({}, props, {
    labelStyle: [localStyles.labelStyle, props.labelStyle],
    textStyle: [localStyles.textStyle, props.textStyle],
  });

  return <StackedLabelText {...propsForward} />;
};
