import React from 'react';
import { style } from 'app/styles';
// import { style } from 'app/styles';

export interface CaretRightIconProps {
  width?: number;
  height?: number;
  style?: string | object;
}

export const CaretRightIcon = (props: CaretRightIconProps): JSX.Element => {
  const { width = 16, height = 16 } = props;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 512"
      style={style(props.style)}
    >
      <path
        fill="currentColor"
        d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"
      />
    </svg>
  );
};

// required for stateless functional components to show name in enzyme snapshots:
// https://github.com/adriantoine/enzyme-to-json/issues/19#issuecomment-285781119
CaretRightIcon.displayName = 'CaretRightIcon';
