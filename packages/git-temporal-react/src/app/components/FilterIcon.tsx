import React from 'react';

export interface FilterIconProps {
  width?: number;
  height?: number;
}

export const FilterIcon = (props: FilterIconProps): JSX.Element => {
  const { width = 16, height = 16 } = props;

  return (
    <svg
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M463.952 0H48.057C5.419 0-16.094 51.731 14.116 81.941L176 243.882V416c0 15.108 7.113 29.335 19.2 40l64 47.066c31.273 21.855 76.8 1.538 76.8-38.4V243.882L497.893 81.941C528.042 51.792 506.675 0 463.952 0zM288 224v240l-64-48V224L48 48h416L288 224z"
      />{' '}
    </svg>
  );
};
