import React from 'react';
import { style } from 'app/styles';
// import { style } from 'app/styles';

export interface CaretLeftIconProps {
  width?: number;
  height?: number;
  style?: object | string;
}

export const CaretLeftIcon = (props: CaretLeftIconProps): JSX.Element => {
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
        d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
      />
    </svg>
  );
};

// required for stateless functional components to show name in enzyme snapshots:
// https://github.com/adriantoine/enzyme-to-json/issues/19#issuecomment-285781119
CaretLeftIcon.displayName = 'CaretLeftIcon';
