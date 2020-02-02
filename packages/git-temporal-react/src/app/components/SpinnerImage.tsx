import React from 'react';

export interface SpinnerImageProps {
  // Style of the div the SVG is rendered in
  width?: number;
  height?: number;
}

export const SpinnerImage = (props: SpinnerImageProps): JSX.Element => {
  const { height = 200, width = 200 } = props;
  return (
    <svg
      height={height}
      width={width}
      version="1.1"
      id="L2"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
    >
      <circle
        fill="none"
        stroke="#ccc"
        strokeWidth="4"
        strokeMiterlimit="10"
        cx="50"
        cy="50"
        r="48"
      />
      <line
        fill="none"
        strokeLinecap="round"
        stroke="#ccc"
        strokeWidth="4"
        strokeMiterlimit="10"
        x1="50"
        y1="50"
        x2="85"
        y2="50.5"
      >
        <animateTransform
          attributeName="transform"
          dur="2s"
          type="rotate"
          to="0 50 50"
          from="360 50 50"
          repeatCount="indefinite"
        />
      </line>
      <line
        fill="none"
        strokeLinecap="round"
        stroke="#ccc"
        strokeWidth="4"
        strokeMiterlimit="10"
        x1="50"
        y1="50"
        x2="49.5"
        y2="74"
      >
        <animateTransform
          attributeName="transform"
          dur="15s"
          type="rotate"
          to="0 50 50"
          from="360 50 50"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
};

SpinnerImage.displayName = 'SpinnerImage';
