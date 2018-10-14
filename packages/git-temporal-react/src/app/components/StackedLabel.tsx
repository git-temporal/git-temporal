import React from 'react';
import { style } from 'app/styles';

export interface StackedLabelProps {
  // This is the text or JSX that gets wrapped in stacked label
  children: string | JSX.Element;
  label: string;
  title?: string;
  labelStyle?: object | string;
  isSelected?: boolean;
  onLabelClick?: (evt) => void;
}

const defaultContainerStyle = {
  flexGrow: 0,
  marginRight: 20,
  marginBottom: 10,
};

export const StackedLabel = (props: StackedLabelProps): JSX.Element => {
  const labelStyles = [props.labelStyle];
  if (props.isSelected) {
    labelStyles.push('selected');
  } else if (props.onLabelClick) {
    labelStyles.push('selectable');
  }
  return (
    <div style={defaultContainerStyle}>
      <div
        style={style(labelStyles)}
        title={props.title}
        onClick={props.onLabelClick}
      >
        {props.label}
      </div>
      <div>{props.children}</div>
    </div>
  );
};
