import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IAuthorsAndStats } from 'app/interfaces';
import { getAuthorsContainerState } from 'app/selectors';
import { addAuthorFilter, removeAuthorFilter } from 'app/actions';
import { style } from 'app/styles';
import { AuthorCard } from 'app/components/AuthorCard';

export class Authors extends Component<IAuthorsAndStats & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = style('altPanel', {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: 320,
  });

  render() {
    // filteredAuthors is passed to RV List to get it to update on changes
    // to filteredAuthors
    return (
      <div style={this.outerStyle}>
        <AutoSizer>
          {({ height, width }) => (
            // width and height below need minimums for testing
            <List
              width={width || 100}
              height={height || 100}
              rowHeight={110}
              rowRenderer={this.renderRow}
              rowCount={this.props.authors.length}
              filteredAuthors={this.props.filteredAuthors}
            />
          )}
        </AutoSizer>
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
