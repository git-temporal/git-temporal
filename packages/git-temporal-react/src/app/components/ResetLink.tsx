import React from 'react';
import { style } from 'app/styles';
import { UndoIcon } from './UndoIcon';

export interface ResetLinkProps {
  // This is the text or JSX that gets wrapped in stacked label
  children: string | JSX.Element | JSX.Element[];
  onClick: (evt) => void;
  title?: string;
  style?: object;
}

const defaultContainerStyle = {
  _extends: ['smallerText', 'link', 'inlineBlock'],
  marginRight: '@margins.pageRight+px',
  marginLeft: '@margins.medium+px',
};

export const ResetLink = (props: ResetLinkProps): JSX.Element => {
  return (
    <div
      style={style(defaultContainerStyle, props.style)}
      onClick={props.onClick}
    >
      <UndoIcon height={10} width={10} /> {props.children}
    </div>
  );
};

ResetLink.displayName = 'ResetLink';
