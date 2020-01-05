import React from 'react';
import { style } from 'app/styles';

import { ExplodeOnChange } from 'app/components/ExplodeOnChange';
import { EpochDateTime } from 'app/components/EpochDateTime';

export interface ExplodingDateRangeProps {
  startDate: number;
  endDate: number;
  isDefaultDates: boolean;
}

const styles = {
  date: {
    _extends: 'largerText',
    transition: 'all 2s ease -in -out',
  },
  dateSelected: {
    _extends: 'bigText',
    color: '@colors.selected',
  },
};

const dateOptions = {
  month: 'long',
  timeZoneName: 'short',
};

export const ExplodingDateRange = (
  props: ExplodingDateRangeProps
): JSX.Element => {
  const epochStyle = [
    styles.date,
    props.isDefaultDates ? {} : styles.dateSelected,
  ];

  return (
    <div style={style(epochStyle)}>
      <ExplodeOnChange value={props.startDate}>
        <EpochDateTime
          value={props.startDate}
          displayOptions={dateOptions}
          style={style(epochStyle)}
        />
      </ExplodeOnChange>{' '}
      to{' '}
      <ExplodeOnChange value={props.endDate}>
        <EpochDateTime
          value={props.endDate}
          displayOptions={dateOptions}
          style={style(epochStyle)}
        />
      </ExplodeOnChange>
    </div>
  );
};
