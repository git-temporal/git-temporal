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

  componentWillUnmount() {
    console.log('git-temporal-react: unmounting Authors');
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
  readonly listStyle = { display: 'flex', flexGrow: 1 };

  render() {
    const { authorsContainerSort } = this.props;
    const sortTitle = authorsContainerSort;
    console.log('git-temporal-react: rendering Authors');
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
    const { authors, authorsContainerSort, highlightedCommitIds } = this.props;

    // authorsContainerSort and highlightedCommitIds are passed
    // to the list to force it to update when they change. as you do
    return (
      <List
        width={
          width || 100 // width and height below need minimums for testing
        }
        height={height || 100}
        rowHeight={120}
        rowRenderer={this.renderRow}
        rowCount={authors.length}
        authorsContainerSort={authorsContainerSort}
        highlightedCommitIds={highlightedCommitIds}
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
      highlightedCommitIds,
    } = this.props;
    const isHighlighted =
      highlightedCommitIds &&
      highlightedCommitIds.length > 0 &&
      author.commits
        .map(c => {
          return c.id;
        })
        .includes(highlightedCommitIds[0]);
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
        isHighlighted={isHighlighted}
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
