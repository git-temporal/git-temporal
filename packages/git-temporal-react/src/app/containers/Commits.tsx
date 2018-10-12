import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

import { DispatchProps, IFilteredCommits } from 'app/interfaces';
import { getFilteredCommits } from 'app/selectors';
import { style } from 'app/styles';
import { CommitCard } from 'app/components/CommitCard';

export class Commits extends Component<IFilteredCommits & DispatchProps> {
  private _cache;
  private _list = null;

  private _listWidth = 400;

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this._cache = new CellMeasurerCache({
      minHeight: 40,
      fixedWidth: true,
    });
  }

  componentDidUpdate(prevProps, _prevState) {
    if (this.props.commits !== prevProps.commits) {
      const index = prevProps.commits.length;
      this._cache.clear(index, 0);
      if (this._list) {
        this._list.recomputeRowHeights(index);
      }
    }
  }

  readonly outerStyle = style('borderedPanel', {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: this._listWidth,
  });

  render() {
    return (
      <div style={this.outerStyle}>
        <AutoSizer>
          {({ height }) => {
            return (
              <List
                width={this._listWidth}
                height={height || 100}
                rowHeight={this._cache.rowHeight}
                rowRenderer={this.renderRow}
                rowCount={this.props.commits.length}
                ref={this._setListRef}
                deferredMeasurementCache={this._cache}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  }
  renderRow({ index, key, parent, style }) {
    // console.log('render row', row);
    const commit = this.props.commits[index];

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        overscanRowCount={10}
        parent={parent}
        rowIndex={index}
        width={this._listWidth}
      >
        <div style={style}>
          <CommitCard commit={commit} />
        </div>
      </CellMeasurer>
    );
  }

  _setListRef = ref => {
    this._list = ref;
  };
}

export const mapStateToProps = state => {
  return getFilteredCommits(state);
};

export default connect(mapStateToProps)(Commits);
