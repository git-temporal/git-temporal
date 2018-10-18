import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IAuthorsAndStats } from 'app/interfaces';
import { getAuthorsContainerState } from 'app/selectors';
import { addAuthorFilter, removeAuthorFilter } from 'app/actions';
import { style } from 'app/styles';
import { AuthorCard } from 'app/components/AuthorCard';
import { ActionMenu } from 'app/components/ActionMenu';

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
  readonly actionMenuStyle = {
    _extends: 'normalText',
    position: 'absolute',
    right: 10,
  };
  readonly listStyle = {
    display: 'flex',
    flexGrow: 1,
  };

  render() {
    // filteredAuthors is passed to RV List to get it to update on changes
    // to filteredAuthors
    return (
      <div style={style(this.outerStyle)}>
        <ActionMenu style={style(this.actionMenuStyle)}>
          <div>This is the first Action</div>
          <div>This is the second</div>
        </ActionMenu>
        <div style={style(this.headerStyle)}>
          <span>Authors by Impact </span>
        </div>
        <div style={style(this.listStyle)}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={
                  width || 100 // width and height below need minimums for testing
                }
                height={height || 100}
                rowHeight={110}
                rowRenderer={this.renderRow}
                rowCount={this.props.authors.length}
                filteredAuthors={this.props.filteredAuthors}
              />
            )}
          </AutoSizer>
        </div>
      </div>
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
}

export const mapStateToProps = state => {
  return getAuthorsContainerState(state);
};

export default connect(mapStateToProps)(Authors);
