import React from 'react';

import { DateTime } from 'app/components/DateTime';

export interface EpochDateTimeProps {
  value: number;
  style?: object;
  displayOptions?: object;
}

// numbers for humans have commas
export const EpochDateTime = (props: EpochDateTimeProps): JSX.Element => {
  const dateTime = new Date(props.value * 1000);
  return (
    <DateTime
      value={dateTime}
      style={props.style}
      displayOptions={props.displayOptions}
    />
  );
};
