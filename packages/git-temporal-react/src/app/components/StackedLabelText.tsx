import React from 'react';
import { style } from 'app/styles';

export interface StackedLabelTextProps {
  label: string;
  text: string;
  labelStyle?: object | string;
  textStyle?: object | string;
  onLabelClick?: (evt) => void;
}

const defaultContainerStyle = {
  flexGrow: 0,
  marginRight: 20,
  marginBottom: 10,
};

export const StackedLabelText = (props: StackedLabelTextProps): JSX.Element => {
  return (
    <div style={defaultContainerStyle}>
      <div style={style(props.labelStyle)} onClick={props.onLabelClick}>
        {props.label}
      </div>
      <div style={style(props.textStyle)}>{props.text}</div>
    </div>
  );
};
