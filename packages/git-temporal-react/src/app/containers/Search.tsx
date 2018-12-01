import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getSearchContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { setSearch } from 'app/actions';
import { SearchInput } from 'app/components/SearchInput';
import { Popup } from 'app/components/Popup';
import { Selectable } from 'app/components/Selectable';

import { debounce } from 'app/utilities/debounce';

interface SearchProps {
  search?: string;
}

interface SearchLocalState {
  searchHasFocus: boolean;
  selectedSuggestion: string;
}

const initialState = {
  searchHasFocus: false,
  selectedSuggestion: 'all',
};

const containerStyle = {
  width: 250,
  overflow: 'visible',
  position: 'relative',
};

const searchInputStyle = {
  width: '100%',
  borderRadius: 10,
  marginLeft: 10,
  marginTop: 0,
};

const popupStyle = {
  marginRight: 0,
};

const suggestedSearchPrefixes = ['author:', 'commit:', 'file:'];

export class Search extends Component<
  SearchProps & DispatchProps,
  SearchLocalState
> {
  readonly state: SearchLocalState = initialState;
  private debouncedOnBlur;

  constructor(props) {
    super(props);
    // we need to delay the closing of the popup on search input blur or
    // else the menu items will not fire a click event
    this.debouncedOnBlur = debounce(this.onSearchBlur, 200);
  }

  render() {
    const isPopupOpen =
      this.state.searchHasFocus &&
      this.props.search &&
      this.props.search.trim().length > 0;
    return (
      <div style={style(containerStyle)}>
        <SearchInput
          value={this.props.search}
          onChange={this.onSearch}
          onClear={this.onClear}
          onFocus={this.onSearchFocus}
          onBlur={this.debouncedOnBlur}
          onKeyDown={this.onKeyboard}
          style={style(searchInputStyle)}
          placeholder="search authors, files or commits"
        />
        <Popup isOpen={isPopupOpen} style={style(popupStyle)} noBackdrop>
          {this.renderPopupSuggestions()}
        </Popup>
      </div>
    );
  }

  private renderPopupSuggestions(): JSX.Element[] {
    const unPrefixedSearch = this.getUnprefixedSearch();
    const menuItems: JSX.Element[] = [
      <Selectable
        value="all"
        key="searchSuggestion_all"
        onClick={this.onSuggestClick}
        selected={this.state.selectedSuggestion === 'all'}
      >
        <div>Search everywhere for '{unPrefixedSearch}'</div>
      </Selectable>,
    ];

    return menuItems.concat(
      suggestedSearchPrefixes.map((prefix, index) => {
        return (
          <Selectable
            key={`searchSuggestion_${index}`}
            value={prefix}
            onClick={this.onSuggestClick}
            selected={this.state.selectedSuggestion === prefix}
          >
            <div style={style('normalText')}>
              {prefix} {unPrefixedSearch}
            </div>
          </Selectable>
        );
      })
    );
  }

  private onSearch = value => {
    this.props.dispatch(setSearch(value || ''));
  };

  private onClear = () => {
    this.props.dispatch(setSearch(''));
  };

  private onSearchFocus = () => {
    this.setState({ searchHasFocus: true });
  };

  private onSearchBlur = () => {
    this.setState({ searchHasFocus: false });
  };

  private onSuggestClick = (_evt, value) => {
    this.selectSuggestion(value);
  };

  private selectSuggestion(value) {
    const newSearch =
      value === 'all'
        ? this.getUnprefixedSearch()
        : `${value}${this.getUnprefixedSearch()}`;
    this.props.dispatch(setSearch(newSearch));
    this.setState({ selectedSuggestion: value });
  }

  private onKeyboard = evt => {
    const currentPrefixIndex =
      this.state.selectedSuggestion === 'all'
        ? -1
        : suggestedSearchPrefixes.indexOf(this.state.selectedSuggestion);

    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      const newSelection =
        currentPrefixIndex < suggestedSearchPrefixes.length - 1
          ? suggestedSearchPrefixes[currentPrefixIndex + 1]
          : 'all';
      this.setState({ selectedSuggestion: newSelection });
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      const newSelection =
        currentPrefixIndex === 0
          ? 'all'
          : currentPrefixIndex > 0
            ? suggestedSearchPrefixes[currentPrefixIndex - 1]
            : suggestedSearchPrefixes[suggestedSearchPrefixes.length - 1];
      this.setState({ selectedSuggestion: newSelection });
    } else if (evt.key === 'Enter') {
      this.selectSuggestion(this.state.selectedSuggestion);
      return;
    }
  };

  private getUnprefixedSearch() {
    const { search } = this.props;
    const matches = search && search.match(/^[^\:]*\:(.*)/);
    if (!matches || matches.length < 2) {
      return search;
    }
    return matches[1];
  }
}

export default connect(getSearchContainerState)(Search);
