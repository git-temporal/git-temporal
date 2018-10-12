import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IFilteredCommits } from 'app/interfaces';
import { getFilteredCommits } from 'app/selectors';
import { style } from 'app/styles';
import { CommitCard } from 'app/components/CommitCard';

export class Commits extends Component<IFilteredCommits & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = style('borderedPanel', {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: 400,
  });

  render() {
    return (
      <div style={this.outerStyle}>
        <AutoSizer>
          {(
            { height, width } // width and height below need minimums for testing
          ) => (
            <List
              width={width || 100}
              height={height || 100}
              rowHeight={60}
              rowRenderer={this.renderRow}
              rowCount={this.props.commits.length}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
  renderRow({ index, style, key }) {
    // console.log('render row', row);
    const commit = this.props.commits[index];
    style.width = 'calc(100% - 20px)';
    return <CommitCard key={key} style={style} commit={commit} />;
  }
}

export const mapStateToProps = state => {
  return getFilteredCommits(state);
};

export default connect(mapStateToProps)(Commits);
