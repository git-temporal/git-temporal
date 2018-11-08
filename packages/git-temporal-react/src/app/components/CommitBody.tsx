import React from 'react';
import { style } from 'app/styles';

export interface CommitBodyProps {
  text: string;
  style?: object;
  isExpanded?: boolean;
}

const containerStyle = {
  _extends: ['normalText', 'block'],
  position: 'relative',
  marginLeft: 10,
};
const constrainedStyle = {
  maxHeight: 70,
  overflow: 'hidden',
  marginBottom: 10,
  boxShadow: 'rgba(245, 245, 245, 0.5) 0px -34px 11px -18px inset',
};
const constrainedIndicatorStyle = {
  position: 'absolute',
  bottom: 0,
  display: 'block',
  height: 20,
  width: '100%',
  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  background: 'linear-gradient(#ffffff00, white)',
};

const breakLineStyle = {
  display: 'block',
  marginBottom: 5,
};

const renderBreakLine = (line, index) => {
  return (
    <div key={index} style={style(breakLineStyle)}>
      {line}
    </div>
  );
};

const renderBrText = text => {
  return text.split(/\<br\>/gi).map(renderBreakLine);
};

const renderContstrainedIndicator = isExpanded => {
  return isExpanded ? null : <div style={style(constrainedIndicatorStyle)} />;
};

// numbers for humans have commas
export const CommitBody = (props: CommitBodyProps): JSX.Element => {
  if (!props.text || props.text.replace(/\s/g, '') === '') {
    return null;
  }
  const styles = [containerStyle, props.style];
  if (!props.isExpanded) {
    styles.push(constrainedStyle);
  }
  return (
    <div style={style(styles)}>
      {renderBrText(props.text)}
      {renderContstrainedIndicator(props.isExpanded)}
    </div>
  );
};
