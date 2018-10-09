import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps } from 'app/interfaces';
import { getAuthorsAndStats } from 'app/selectors';
import { style } from 'app/styles';
import { AuthorCard } from 'app/components/AuthorCard';

interface AuthorsProps {
  authors?: any[];
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
}

export class Authors extends Component<AuthorsProps & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = style('panel', {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: 270,
  });

  render() {
    return (
      <div style={this.outerStyle}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowHeight={100}
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
