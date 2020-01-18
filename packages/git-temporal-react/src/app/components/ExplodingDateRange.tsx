import React from 'react';
import { style } from 'app/styles';

import { ExplodingDate } from 'app/components/ExplodingDate';

export interface ExplodingDateRangeProps {
  startDate: number;
  endDate: number;
  style?: object | string;
}

export const ExplodingDateRange = (
  props: ExplodingDateRangeProps
): JSX.Element => {
  return (
    <div style={style(props.style)}>
      <ExplodingDate value={props.startDate} style={props.style} /> to{' '}
      <ExplodingDate value={props.endDate} style={props.style} />
    </div>
  );
};
