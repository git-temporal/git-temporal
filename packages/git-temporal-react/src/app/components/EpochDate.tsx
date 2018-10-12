import React from 'react';
import { style } from 'app/styles';

export interface EpochDateProps {
  epochTime: number;
  style?: object;
}

const dateDisplayOptions = { year: 'numeric', month: 'long', day: 'numeric' };

// numbers for humans have commas
export const EpochDate = (props: EpochDateProps): JSX.Element => {
  const humanDate = new Date(props.epochTime * 1000).toLocaleDateString(
    'en-US',
    dateDisplayOptions
  );
  return <span style={style(props.style)}>{humanDate}</span>;
};
