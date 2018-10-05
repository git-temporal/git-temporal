import React from 'react';
import { style } from 'app/styles';

export interface StackedLabelProps {
  // This is the text or JSX that gets wrapped in stacked label
  children: string | JSX.Element;
  label: string;
  labelStyle?: object | string;
  onLabelClick?: (evt) => void;
}

const defaultContainerStyle = {
  flexGrow: 0,
  marginRight: 20,
  marginBottom: 10,
};

export const StackedLabel = (props: StackedLabelProps): JSX.Element => {
  return (
    <div style={defaultContainerStyle}>
      <div style={style(props.labelStyle)} onClick={props.onLabelClick}>
        {props.label}
      </div>
      <div>{props.children}</div>
    </div>
  );
};
