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
  _extends: ['flexRows', 'borderedPanel', 'normalText', 'selectable'],
  position: 'relative',
  padding: 5,
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
const searchIconStyle = {
  marginTop: 2,
};

export class SearchInput extends React.Component<SearchInputProps> {
  static displayName = 'SearchInput';

  private inputRef;

  componentDidMount() {
    this.inputRef && this.inputRef.focus();
  }

  render() {
    const { value, onChange, onClear, placeholder } = this.props;
    return (
      <div style={style(containerStyle, this.props.style)}>
        <SearchIcon height={16} width={16} style={style(searchIconStyle)} />
        <input
          type="text"
          style={searchInputStyle}
          value={value}
          placeholder={placeholder}
          onChange={evt => {
            onChange(evt.target.value);
          }}
          ref={input => {
            this.inputRef = input;
          }}
        />
        <div style={style(clearIconStyle)} onClick={onClear}>
          X
        </div>
      </div>
    );
  }
}
