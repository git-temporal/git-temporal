import React from 'react';
import { style } from 'app/styles';

import { ExplodeOnChange } from 'app/components/ExplodeOnChange';
import { EpochDateTime } from 'app/components/EpochDateTime';

export interface ExplodingDateProps {
  value: number;
  style?: object | string;
}

const dateOptions = {
  month: 'long',
  timeZoneName: 'short',
};

export const ExplodingDate = (props: ExplodingDateProps): JSX.Element => {
  return (
    <ExplodeOnChange value={props.value}>
      <EpochDateTime
        value={props.value}
        displayOptions={dateOptions}
        style={style(props.style)}
      />
    </ExplodeOnChange>
  );
};
