import React from 'react';
import { style } from 'app/styles';

export interface DateTimeProps {
  value: Date;
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  displayOptions?: object;
  style?: object;
}

const defaultDisplayOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
};

// numbers for humans have commas
export const DateTime = (props: DateTimeProps): JSX.Element => {
  const displayOptions = Object.assign(
    {},
    defaultDisplayOptions,
    props.displayOptions
  );
  const humanDateTime = props.value.toLocaleString('en-US', displayOptions);
  return <span style={style(props.style)}>{humanDateTime}</span>;
};
