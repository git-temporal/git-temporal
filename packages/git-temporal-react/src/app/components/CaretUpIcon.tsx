import React from 'react';
import { style } from 'app/styles';
// import { style } from 'app/styles';

export interface CaretUpIconProps {
  width?: number;
  height?: number;
  style?: string | object;
}

export const CaretUpIcon = (props: CaretUpIconProps): JSX.Element => {
  const { width = 16, height = 16 } = props;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      style={style(props.style)}
    >
      <path
        fill="currentColor"
        d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"
      />{' '}
    </svg>
  );
};

// required for stateless functional components to show name in enzyme snapshots:
// https://github.com/adriantoine/enzyme-to-json/issues/19#issuecomment-285781119
CaretUpIcon.displayName = 'CaretUpIcon';
