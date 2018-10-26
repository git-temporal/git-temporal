import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IAuthorsAndStats } from 'app/interfaces';
import { getAuthorsContainerState } from 'app/selectors';
import {
  addAuthorFilter,
  removeAuthorFilter,
  setAuthorsContainerSearch,
} from 'app/actions';
import { style } from 'app/styles';
import { AuthorCard } from 'app/components/AuthorCard';
import { SearchToggle } from 'app/components/SearchToggle';

import AuthorsActionMenu from 'app/containers/AuthorsActionMenu';
import { AuthorsContainerFilters } from 'app/actions/ActionTypes';

export class Authors extends Component<IAuthorsAndStats & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = {
    _extends: ['altPanel', 'flexColumns'],
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: 320,
  };
  readonly headerStyle = {
    _extends: ['h2Text'],
    display: 'block',
    flexGrow: 0,
  };
  readonly SearchToggleStyle = {
    position: 'absolute',
    width: 205,
    right: 29,
  };
  readonly listStyle = {
    display: 'flex',
    flexGrow: 1,
  };

  render() {
    const { authorsContainerFilter, authorsContainerSort } = this.props;
    const filterTitle =
      authorsContainerFilter === AuthorsContainerFilters.FILTERED
        ? 'Filtered '
        : '';
    const sortTitle = authorsContainerSort;

    // filteredAuthors is passed to RV List to get it to update on changes
    // to filteredAuthors
    return (
      <div style={style(this.outerStyle)}>
        <AuthorsActionMenu />
        <div style={style(this.headerStyle)}>
          <span data-testId="header">
            {filterTitle}
            Authors by {sortTitle}
          </span>
        </div>
        <SearchToggle
          value={this.props.authorsContainerSearch}
          style={style(this.SearchToggleStyle)}
          onChange={this.onSearch}
        />
        <div style={style(this.listStyle)}>
          <AutoSizer>
            {({ height, width }) => {
              // filteredAuthors, authorsContainerFilter and authorsContainerSort are passed
              // to the list to force it to update when they change
              return this.renderList(height, width);
            }}
          </AutoSizer>
        </div>
      </div>
    );
  }
  renderList(height, width) {
    const {
      authors,
      filteredAuthors,
      authorsContainerFilter,
      authorsContainerSort,
    } = this.props;
    return (
      <List
        width={
          width || 100 // width and height below need minimums for testing
        }
        height={height || 100}
        rowHeight={110}
        rowRenderer={this.renderRow}
        rowCount={authors.length}
        filteredAuthors={filteredAuthors}
        authorsContainerFilter={authorsContainerFilter}
        authorsContainerSort={authorsContainerSort}
      />
    );
  }
  renderRow({ index, style, key }) {
    // console.log('render row', row);
    const author = this.props.authors[index];
    const {
      totalLinesAdded,
      totalLinesDeleted,
      totalCommits,
      maxImpact,
      maxCommits,
    } = this.props;
    style.width = 'calc(100% - 20px)';
    return (
      <AuthorCard
        key={key}
        style={style}
        author={author}
        totalLinesAdded={totalLinesAdded}
        totalLinesDeleted={totalLinesDeleted}
        totalCommits={totalCommits}
        maxImpact={maxImpact}
        maxCommits={maxCommits}
        onFilterToggle={() =>
          this.onAuthorFilterToggle(author.authorName, author.isFiltered)
        }
      />
    );
  }
  onAuthorFilterToggle(authorName: string, isSelected: boolean): void {
    const { dispatch } = this.props;
    if (isSelected) {
      dispatch(removeAuthorFilter(authorName));
    } else {
      dispatch(addAuthorFilter(authorName));
    }
  }

  onSearch = value => {
    this.props.dispatch(setAuthorsContainerSearch(value));
  };
}

export default connect(getAuthorsContainerState)(Authors);
