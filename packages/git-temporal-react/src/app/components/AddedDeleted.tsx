import React from 'react';
import { style } from 'app/styles';

import { CommaNumber } from 'app/components/CommaNumber';

export interface AddedDeletedProps {
  linesAdded: number;
  linesDeleted: number;
  style?: object;
}

// numbers for humans have commas
export const AddedDeleted = (props: AddedDeletedProps): JSX.Element => {
  return (
    <span style={style('smallerText', { float: 'right' }, props.style)}>
      <span style={style('linesAdded')}>
        +<CommaNumber value={props.linesAdded} />
      </span>
      <span> / </span>
      <span style={style('linesDeleted')}>
        -<CommaNumber value={props.linesDeleted} />
      </span>
    </span>
  );
};
