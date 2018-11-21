import React from 'react';
import { style } from 'app/styles';

export interface ErrorProps {
  message: string;
  htmlDetailMessage: string;
  style?: object | string;
}

export const Error = (props: ErrorProps): JSX.Element => {
  return (
    <div style={style(props.style)}>
      <div style={style('h2Text')}>Well, that didn't work...</div>
      <div style={style('h3Text', 'errorText')}>{props.message}</div>
      <div dangerouslySetInnerHTML={{ __html: props.htmlDetailMessage }} />>
    </div>
  );
};

Error.displayName = 'Error';
