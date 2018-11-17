import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { highlightCommits } from 'app/actions';
import { DispatchProps, IAuthorsContainerState } from 'app/interfaces';
import { getAuthorsContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { AuthorCard } from 'app/components/AuthorCard';

import AuthorsActionMenu from 'app/containers/AuthorsActionMenu';

export class Authors extends Component<IAuthorsContainerState & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = {
    _extends: ['altPanel', 'flexColumns'],
    display: 'flex',
    position: 'relative',
    minWidth: 320,
    maxWidth: 320,
  };
  readonly headerStyle = {
    _extends: ['h2Text'],
    display: 'block',
    flexGrow: 0,
  };
  readonly listStyle = {
    display: 'flex',
    flexGrow: 1,
  };

  render() {
    const { authorsContainerSort } = this.props;
    const sortTitle = authorsContainerSort;

    return (
      <div style={style(this.outerStyle)}>
        <AuthorsActionMenu />
        <div style={style(this.headerStyle)}>
          <span data-testId="header">Authors by {sortTitle}</span>
        </div>
        <div style={style(this.listStyle)}>
          <AutoSizer>
            {({ height, width }) => {
              return this.renderList(height, width);
            }}
          </AutoSizer>
        </div>
      </div>
    );
  }
  renderList(height, width) {
    const { authors, authorsContainerSort } = this.props;

    // authorsContainerSort is passed to the list to force it to update when they change
    return (
      <List
        width={
          width || 100 // width and height below need minimums for testing
        }
        height={height || 100}
        rowHeight={110}
        rowRenderer={this.renderRow}
        rowCount={authors.length}
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
        index={index}
        style={style}
        author={author}
        totalLinesAdded={totalLinesAdded}
        totalLinesDeleted={totalLinesDeleted}
        totalCommits={totalCommits}
        maxImpact={maxImpact}
        maxCommits={maxCommits}
        onClick={this.onAuthorClick}
      />
    );
  }

  onAuthorClick = (_evt, author) => {
    const commitIds = author.commits.map(commit => {
      return commit.id;
    });
    this.props.dispatch(highlightCommits(commitIds));
  };
}

export default connect(getAuthorsContainerState)(Authors);
