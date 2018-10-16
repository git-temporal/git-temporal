import React from 'react';
import { style } from 'app/styles';

export interface ToggleButtonProps {
  // This is the text or JSX that gets wrapped in a Toggle Button
  children: string | JSX.Element;
  isSelected: boolean;
  onClick: (evt) => void;
  style?: string | object;
}

export const ToggleButton = (props: ToggleButtonProps): JSX.Element => {
  const styles: any = ['button'];
  if (props.isSelected) {
    styles.push('selected');
  } else {
    styles.push('selectable');
  }
  styles.push(props.style);
  return (
    <div style={style(styles)} onClick={props.onClick}>
      {props.children}
    </div>
  );
};
