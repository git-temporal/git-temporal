import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import { debug } from '@git-temporal/logger';

import { highlightCommits, selectPath } from 'app/actions';
import { DispatchProps, ICommitsContainerState } from 'app/interfaces';
import { getCommitsContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { ExtendingList } from 'app/components/ExtendingList';
import { CommitCard } from 'app/components/CommitCard';
import CommitsActionMenu from './CommitsActionMenu';

export class Commits extends Component<ICommitsContainerState & DispatchProps> {
  private _cache;
  private _list = null;

  private _listWidth = 400;
  private highlightedIndex = null;
  private scrollToIndexOnNextRender = null;

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);

    this._cache = new CellMeasurerCache({ fixedWidth: true });
  }

  componentWillUnmount() {
    debug('unmounting Commits');
  }

  componentDidUpdate(prevProps, _prevState) {
    if (
      this.props.commits !== prevProps.commits ||
      this.props.selectedPath !== prevProps.selectedPath ||
      this.props.commitsContainerSort !== prevProps.commitsContainerSort
    ) {
      this.remeasureCells();
    }
  }

  readonly outerStyle = {
    _extends: ['borderedPanel', 'flexColumns'],
    position: 'relative',
    minWidth: 400,
    maxWidth: this._listWidth,
  };
  readonly headerStyle = {
    _extends: ['h2Text'],
    display: 'block',
    flexGrow: 0,
    position: 'relative',
    marginRight: 30,
  };

  render() {
    debug('rendering commits', this.props.commits);

    const scrollToIndex = this.scrollToIndexOnNextRender || 0;
    const sortTitle = this.props.commitsContainerSort;
    return (
      <div style={style(this.outerStyle)}>
        <CommitsActionMenu />
        <div style={style(this.headerStyle)}>
          <span data-testId="header">Commits by {sortTitle}</span>
        </div>
        <div style={{ flexGrow: 1 }}>
          <AutoSizer>
            {({ height }) => {
              return this.renderList(height, scrollToIndex);
            }}
          </AutoSizer>
        </div>
      </div>
    );
  }

  renderList(height, scrollToIndex) {
    const listStyle = {
      width: this._listWidth,
      height: height || 100,
    };
    // This originally used List from react-virtualized to render the list
    // but it needed CellMeasurer which didn't work in VSCode webview :/
    return (
      <ExtendingList
        rowCount={this.props.commits.length}
        rowRenderer={this.renderRow}
        style={listStyle}
      />
    );
  }

  renderRow(index: number, key: string | number) {
    // debug('render row', row);
    const commit = this.props.commits[index];
    let isHighlighted = false;
    let isExpanded = false;
    if (
      this.props.highlightedCommitIds &&
      this.props.highlightedCommitIds.length > 0
    ) {
      isHighlighted = this.props.highlightedCommitIds.includes(commit.id);
      isExpanded = this.props.highlightedCommitIds[0] === commit.id;
    }

    if (isHighlighted) {
      this.highlightedIndex = index;
    }
    return (
      <div key={key}>
        <CommitCard
          commit={commit}
          index={index}
          isHighlighted={isHighlighted}
          isExpanded={isExpanded}
          onClick={this.onCommitCardClick}
          onFileClick={this.onFileClick}
          hideFiles={this.props.isFileSelected}
        />
      </div>
    );
  }

  onCommitCardClick = (event, commit, index) => {
    event.stopPropagation();
    const { highlightedCommitIds } = this.props;
    let newHighlightedCommitIds = [commit.id];
    if (highlightedCommitIds && highlightedCommitIds.length > 0) {
      const index = highlightedCommitIds.indexOf(commit.id);
      if (index !== -1) {
        // moving it to the top causes it to also be the expanded
        // commit card.
        newHighlightedCommitIds = newHighlightedCommitIds.concat(
          highlightedCommitIds
            .slice(0, index)
            .concat(highlightedCommitIds.slice(index + 1))
        );
      }
    }
    this.props.dispatch(highlightCommits(newHighlightedCommitIds));
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
      this._cache.clear(this.highlightedIndex, 0);
      this._cache.clear(index, 0);
    } else {
      this._cache.clearAll();
    }
    this._list && this._list.recomputeRowHeights();
  }
}

export default connect(getCommitsContainerState)(Commits);
