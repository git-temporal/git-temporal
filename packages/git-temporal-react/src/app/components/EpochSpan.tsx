import React from 'react';
import { style } from 'app/styles';

export interface EpochSpanProps {
  // This is the text or JSX that gets wrapped in stacked label
  firstEpochTime: number;
  secondEpochTime: number;
  style?: object | string;
}

const secondsPer = {
  year: 31556926,
  month: 2629743,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
};

export function convertEpochDatesToTimeSpan(
  firstEpochTime: number,
  secondEpochTime: number
): string {
  const timeSpan = Math.abs(firstEpochTime - secondEpochTime);
  for (const timeComponent in secondsPer) {
    const seconds = secondsPer[timeComponent];
    if (timeSpan > seconds) {
      const roundedNumberForComponent = Math.round(timeSpan / seconds);
      const label =
        roundedNumberForComponent === 1 ? timeComponent : `${timeComponent}s`;
      return `${roundedNumberForComponent} ${label}`;
    }
  }
  return '0 seconds';
}
export const EpochSpan = (props: EpochSpanProps): JSX.Element => {
  return (
    <span style={style(props.style)}>
      {convertEpochDatesToTimeSpan(props.firstEpochTime, props.secondEpochTime)}
    </span>
  );
};