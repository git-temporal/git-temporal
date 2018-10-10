import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IAuthorsAndStats } from 'app/interfaces';
import { getAuthorsAndStats } from 'app/selectors';
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
    maxWidth: 280,
  });

  render() {
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
      />
    );
  }
}

export const mapStateToProps = state => {
  return getAuthorsAndStats(state);
};

export default connect(mapStateToProps)(Authors);
