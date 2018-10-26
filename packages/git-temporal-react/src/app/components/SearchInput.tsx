import React from 'react';
import { style } from 'app/styles';

import { SearchIcon } from 'app/components/SearchIcon';

export interface SearchInputProps {
  value: string;
  onChange: (value) => void;
  onClear: () => void;
  placeholder?: string;
  style?: object;
}

const containerStyle = {
  _extends: ['flexRows', 'borderedPanel', 'normalText'],
  position: 'relative',
  padding: 5,
  border: '1px solid grey',
};
const searchInputStyle = {
  flexGrow: 1,
  border: 'none',
  fontSize: 14,
  margin: '0px 5px',
};
const clearIconStyle = {
  _extends: ['smallerText'],
  paddingTop: 3,
  flexGrow: 0,
  cursor: 'pointer',
};

export const SearchInput = (props: SearchInputProps): JSX.Element => {
  return (
    <div style={style(containerStyle, props.style)}>
      <SearchIcon height={16} width={16} />
      <input
        type="text"
        style={searchInputStyle}
        value={props.value}
        onChange={evt => {
          props.onChange(evt.target.value);
        }}
      />
      <div style={style(clearIconStyle)} onClick={props.onClear}>
        X
      </div>
    </div>
  );
};
