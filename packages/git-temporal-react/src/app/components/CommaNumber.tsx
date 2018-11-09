import React from 'react';
import { style } from 'app/styles';

export interface NumberProps {
  // This is the text or JSX that gets wrapped in stacked label
  value: string | number;
  style?: object | string;
}

export function convertNumberToStringWithCommas(numberValue: string | number) {
  let numericValue = parseFloat(numberValue as string);
  if (isNaN(numericValue)) {
    numericValue = 0;
  }
  const [wholeNumber, decimal] = numericValue.toString().split('.');
  let convertedValue = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimal) {
    convertedValue += `.${decimal}`;
  }
  return convertedValue;
}
// numbers for humans have commas
export const CommaNumber = (props: NumberProps): JSX.Element => {
  return (
    <span style={style(props.style)}>
      {convertNumberToStringWithCommas(props.value)}
    </span>
  );
};

CommaNumber.displayName = 'CommaNumber';
