import React from 'react';
import { style } from 'app/styles';

// import { SearchInput } from 'app/components/SearchInput';
import { SearchIcon } from 'app/components/SearchIcon';
import { SearchInput } from 'app/components/SearchInput';

export interface SearchToggleProps {
  value: string;
  onChange: (value) => void;
  placeholder?: string;
  style?: object;
}

const initialState = {
  showSearchInput: false,
};

type SearchToggleState = Readonly<typeof initialState>;

const iconStyle = {
  _extends: ['selectable'],
  width: 25,
  height: 23,
  textAlign: 'center',
  paddingTop: 6,
  marginRight: 12,
};

export class SearchToggle extends React.Component<
  SearchToggleProps,
  SearchToggleState
> {
  readonly state: SearchToggleState = initialState;

  render() {
    const { value, onChange } = this.props;
    if (
      (value && value.toString().trim() !== '') ||
      this.state.showSearchInput
    ) {
      return (
        <SearchInput
          value={value}
          onChange={onChange}
          onClear={this.onClose}
          style={style(this.props.style)}
        />
      );
    }
    return (
      <div
        style={style(iconStyle, this.props.style, {
          width: iconStyle.width,
        })}
        onClick={this.onIconClick}
      >
        <SearchIcon width={16} height={16} />
      </div>
    );
  }
  onIconClick = () => {
    this.setState({ showSearchInput: true });
  };

  onClose = () => {
    this.setState({ showSearchInput: false });
    this.props.onChange('');
  };
}
