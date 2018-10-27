import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

import {
  highlightCommit,
  selectPath,
  setCommitsContainerSearch,
} from 'app/actions';
import { DispatchProps, ICommitsContainerState } from 'app/interfaces';
import { getFilteredCommitsState } from 'app/selectors';
import { style } from 'app/styles';
import { CommitCard } from 'app/components/CommitCard';
import { SearchToggle } from 'app/components/SearchToggle';

export class Commits extends Component<ICommitsContainerState & DispatchProps> {
  private _cache;
  private _list = null;

  private _listWidth = 400;
  private highlightedIndex = null;
  private scrollToIndexOnNextRender = null;

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
    });
  }

  componentDidUpdate(prevProps, _prevState) {
    if (
      this.props.commits !== prevProps.commits ||
      this.props.selectedPath !== prevProps.selectedPath
    ) {
      this.remeasureCells();
    }
  }

  readonly outerStyle = {
    _extends: ['borderedPanel', 'flexColumns'],
    flexGrow: 1,
    position: 'relative',
    maxWidth: this._listWidth,
  };
  readonly headerStyle = {
    _extends: ['h2Text'],
    display: 'block',
    flexGrow: 0,
    position: 'relative',
    marginRight: 0,
  };
  readonly SearchToggleStyle = {
    position: 'absolute',
    width: 205,
    right: 29,
    top: 0,
  };

  render() {
    const scrollToIndex = this.scrollToIndexOnNextRender || 0;
    const sortTitle = this.props.commitsContainerSort;
    return (
      <div style={style(this.outerStyle)}>
        <div style={style(this.headerStyle)}>
          <span data-testId="header">Commits by {sortTitle}</span>
          <SearchToggle
            value={this.props.commitsContainerSearch}
            style={style(this.SearchToggleStyle)}
            onChange={this.onSearch}
          />
        </div>
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
                scrollToIndex={scrollToIndex}
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
            onFileClick={this.onFileClick}
            isFileSelected={this.props.isFileSelected}
          />
        </div>
      </CellMeasurer>
    );
  }

  onSearch = value => {
    this.props.dispatch(setCommitsContainerSearch(value));
  };

  onCommitCardClick = (event, commit, index) => {
    event.stopPropagation();
    this.props.dispatch(highlightCommit(commit.id));
    this.remeasureCells(index);
    this.scrollToIndexOnNextRender = index;
  };

  onFileClick = (event, fileName) => {
    event.stopPropagation();
    this.props.dispatch(selectPath(fileName));
  };

  _setListRef = ref => {
    this._list = ref;
  };

  remeasureCells(index = null) {
    if (index !== null) {
      console.log(`remeasuring cells ${this.highlightedIndex} ${index}`);
      this._cache.clear(this.highlightedIndex, 0);
      this._cache.clear(index, 0);
    } else {
      console.log('remeasuring all cells');
      this._cache.clearAll();
    }
    this._list.recomputeRowHeights();
  }
}

export const mapStateToProps = state => {
  return getFilteredCommitsState(state);
};

export default connect(mapStateToProps)(Commits);
