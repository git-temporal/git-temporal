import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

import { highlightCommit } from 'app/actions';
import { DispatchProps, IFilteredCommits } from 'app/interfaces';
import { getFilteredCommits } from 'app/selectors';
import { style } from 'app/styles';
import { CommitCard } from 'app/components/CommitCard';

export class Commits extends Component<IFilteredCommits & DispatchProps> {
  private _cache;
  private _list = null;

  private _listWidth = 400;
  private highlightedIndex = null;
  private scrollToIndexOnNextRender = null;
  private lastScrollToIndex = null;

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
    });
  }

  componentDidUpdate(prevProps, _prevState) {
    if (this.props.commits !== prevProps.commits) {
      this.remeasureCells(prevProps.commits.length);
    }
  }

  readonly outerStyle = style('borderedPanel', {
    flexGrow: 1,
    position: 'relative',
    maxWidth: this._listWidth,
  });

  render() {
    const scrollToRow = this.scrollToIndexOnNextRender;
    const scrollToAlignment =
      this.lastScrollToIndex && this.lastScrollToIndex < scrollToRow
        ? 'center'
        : 'auto';
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
                scrollToIndex={scrollToRow}
                scrollToAlignment={scrollToAlignment}
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
    const isHighlighted = this.props.highlightedCommitId
      ? this.props.highlightedCommitId === commit.id
      : false;
    if (isHighlighted) {
      this.highlightedIndex = index;
    }
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
          <CommitCard
            commit={commit}
            index={index}
            isExpanded={isHighlighted}
            onClick={this.onCommitCardClick}
          />
        </div>
      </CellMeasurer>
    );
  }

  onCommitCardClick = (event, commit, index) => {
    event.stopPropagation();
    this.props.dispatch(highlightCommit(commit.id));
    this.remeasureCells(index);
    this.scrollToIndexOnNextRender = index;
  };

  _setListRef = ref => {
    this._list = ref;
  };

  remeasureCells(index) {
    this._cache.clear(this.highlightedIndex, 0);
    this._cache.clear(index, 0);
    this._list.recomputeRowHeights();
  }
}

export const mapStateToProps = state => {
  return getFilteredCommits(state);
};

export default connect(mapStateToProps)(Commits);
