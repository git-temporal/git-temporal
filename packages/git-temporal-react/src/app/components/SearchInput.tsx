import React from 'react';
import { style } from 'app/styles';

import { debounce } from 'app/utilities/debounce';
import { SearchIcon } from 'app/components/SearchIcon';

export interface SearchInputProps {
  value: string;
  onChange: (value) => void;
  onClear: () => void;
  onFocus?: (evt) => void;
  onBlur?: (evt) => void;
  onKeyDown?: (evt) => void;
  placeholder?: string;
  style?: object;
}

interface SearchInputState {
  value: string;
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

export class SearchInput extends React.Component<
  SearchInputProps,
  SearchInputState
> {
  static displayName = 'SearchInput';
  readonly state: SearchInputState = { value: '' };

  private inputRef;
  private debouncedCallChangeCallback;

  constructor(props) {
    super(props);
    this.debouncedCallChangeCallback = debounce(this.callChangeCallback, 750);
  }

  componentDidMount() {
    this.inputRef && this.inputRef.focus();
    if (this.props.value !== this.state.value) {
      this.setState({ value: this.props.value });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.value !== this.props.value &&
      this.props.value !== this.state.value
    ) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    const { onClear, onFocus, onBlur, onKeyDown, placeholder } = this.props;
    return (
      <div style={style(containerStyle, this.props.style)}>
        <SearchIcon height={16} width={16} style={style(searchIconStyle)} />
        <input
          type="text"
          style={searchInputStyle}
          value={this.state.value}
          placeholder={placeholder}
          onChange={this.onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
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

  onInputChange = evt => {
    const newValue = evt.target.value;
    this.setState({ value: newValue });
    this.debouncedCallChangeCallback(newValue);
  };

  callChangeCallback = value => {
    this.props.onChange(value);
  };
}
