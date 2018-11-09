import React from 'react';
import { style } from 'app/styles';

export interface EpochSpanProps {
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

export function convertEpochDateTimesToTimeSpan(
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
      {convertEpochDateTimesToTimeSpan(
        props.firstEpochTime,
        props.secondEpochTime
      )}
    </span>
  );
};

EpochSpan.displayName = 'EpochSpan';
