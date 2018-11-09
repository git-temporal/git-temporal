import React from 'react';
import { style } from 'app/styles';

export interface PercentBarProps {
  numerator: number;
  denominator: number;
}

const defaultNumeratorBarStyle = {
  backgroundColor: 'blue',
  height: 10,
};
const defaultDenominatorBarStyle = {
  backgroundColor: 'grey',
  height: 10,
  marginBottom: 5,
};

// numbers for humans have commas
export const PercentBar = ({
  numerator,
  denominator,
}: PercentBarProps): JSX.Element => {
  const percentWidth = (numerator / denominator) * 100;
  return (
    <div style={style(defaultDenominatorBarStyle, { width: '100%' })}>
      <div
        style={style(defaultNumeratorBarStyle, { width: `${percentWidth}%` })}
      />
    </div>
  );
};

PercentBar.displayName = 'PercentBar';
