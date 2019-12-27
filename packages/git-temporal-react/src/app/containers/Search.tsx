import React, { useState } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { style } from 'app/styles';
import { setSearch } from 'app/actions';
import { SearchInput } from 'app/components/SearchInput';
import { Popup } from 'app/components/Popup';
import { Selectable } from 'app/components/Selectable';

import { debounce } from 'app/utilities/debounce';
import { getSearch } from 'app/selectors/stateVars';

const styles = {
  container: {
    alignSelf: 'flex-end',
    marginBottom: '@margins.medium+px',
    overflow: 'visible',
    position: 'relative',
    width: 280,
  },
  searchInput: {
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 0,
    width: 'calc(100% - 22px)',
  },
  popup: {
    marginRight: 0,
  },
};

const suggestedSearchPrefixes = ['author:', 'commit:', 'file:'];

// export class Search extends Component<
//   SearchProps & DispatchProps,
//   SearchLocalState
// > {
export const Search: React.FC = (): React.ReactElement => {
  const [searchHasFocus, setSearchHasFocus] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState('all');
  const search = useSelector(getSearch);
  const dispatch = useDispatch();

  const debouncedOnBlur = debounce(onSearchBlur, 200);

  const isPopupOpen = searchHasFocus && search && search.trim().length > 0;
  return (
    <div style={style(styles.container)}>
      <SearchInput
        value={search}
        onChange={onSearch}
        onClear={onClear}
        onFocus={onSearchFocus}
        onBlur={debouncedOnBlur}
        onKeyDown={onKeyboard}
        style={style(styles.searchInput)}
        placeholder="search authors, files or commits"
      />
      <Popup isOpen={isPopupOpen} style={style(styles.popup)} noBackdrop>
        {renderPopupSuggestions()}
      </Popup>
    </div>
  );

  function renderPopupSuggestions(): JSX.Element[] {
    const unPrefixedSearch = getUnprefixedSearch();
    const menuItems: JSX.Element[] = [
      <Selectable
        value="all"
        key="searchSuggestion_all"
        onClick={onSuggestClick}
        selected={selectedSuggestion === 'all'}
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
            onClick={onSuggestClick}
            selected={selectedSuggestion === prefix}
          >
            <div style={style('normalText')}>
              {prefix} {unPrefixedSearch}
            </div>
          </Selectable>
        );
      })
    );
  }

  function onSearch(value) {
    dispatch(setSearch(value || ''));
  }

  function onClear() {
    dispatch(setSearch(''));
  }

  function onSearchFocus() {
    setSearchHasFocus(true);
  }

  function onSearchBlur() {
    setSearchHasFocus(false);
  }

  function onSuggestClick(_evt, value) {
    selectSuggestion(value);
  }

  function selectSuggestion(value) {
    const newSearch =
      value === 'all'
        ? getUnprefixedSearch()
        : `${value}${getUnprefixedSearch()}`;
    dispatch(setSearch(newSearch));
    setSelectedSuggestion(value);
  }

  function onKeyboard(evt) {
    const currentPrefixIndex =
      selectedSuggestion === 'all'
        ? -1
        : suggestedSearchPrefixes.indexOf(selectedSuggestion);

    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      const newSelection =
        currentPrefixIndex < suggestedSearchPrefixes.length - 1
          ? suggestedSearchPrefixes[currentPrefixIndex + 1]
          : 'all';
      setSelectedSuggestion(newSelection);
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      const newSelection =
        currentPrefixIndex === 0
          ? 'all'
          : currentPrefixIndex > 0
            ? suggestedSearchPrefixes[currentPrefixIndex - 1]
            : suggestedSearchPrefixes[suggestedSearchPrefixes.length - 1];
      setSelectedSuggestion(newSelection);
    } else if (evt.key === 'Enter') {
      selectSuggestion(selectedSuggestion);
      return;
    }
  }

  function getUnprefixedSearch() {
    const matches = search && search.match(/^[^\:]*\:(.*)/);
    if (!matches || matches.length < 2) {
      return search;
    }
    return matches[1];
  }
};
