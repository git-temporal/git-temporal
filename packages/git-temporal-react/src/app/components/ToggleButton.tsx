import React from 'react';
import { style } from 'app/styles';

export interface ToggleButtonProps {
  // This is the text or JSX that gets wrapped in a Toggle Button
  isSelected: boolean;
  onClick: (evt) => void;
  children?: string | JSX.Element | JSX.Element[];
  style?: string | object;
}

export const ToggleButton = (props: ToggleButtonProps): JSX.Element => {
  const styles: any = [];
  if (props.isSelected) {
    styles.push('selected');
  } else {
    styles.push('selectable');
  }
  styles.push(props.style);
  return (
    <div style={style(styles, props.style)} onClick={props.onClick}>
      {props.children || ' '}
    </div>
  );
};
