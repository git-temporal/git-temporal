import React from 'react';
import { style } from 'app/styles';

export interface CommitBodyProps {
  text: string;
  style?: object;
}

const containerStyle = {
  _extends: ['normalText', 'block'],
  marginLeft: 10,
};

const breakLineStyle = {
  display: 'block',
  marginBottom: 5,
};

const renderBreakLine = line => {
  return <div style={style(breakLineStyle)}>{line.replace(/\<br\>/gi)}</div>;
};

const renderBrText = text => {
  return text
    .split(/\<br\>\s*\<br\>/gi)
    .slice(0, -1)
    .map(renderBreakLine);
};

// numbers for humans have commas
export const CommitBody = (props: CommitBodyProps): JSX.Element => {
  return (
    <div style={style(containerStyle, props.style)}>
      {renderBrText(props.text)}
    </div>
  );
};
