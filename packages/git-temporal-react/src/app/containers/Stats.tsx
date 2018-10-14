import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getFilteredStats } from 'app/selectors';
import { style } from 'app/styles';
import { StackedLabelHeader } from 'app/components/StackedLabelHeader';
import { CommaNumber } from 'app/components/CommaNumber';
import { EpochSpan } from 'app/components/EpochSpan';
import { viewCommits, viewFiles } from 'app/actions';

interface StatsProps {
  viewCommitsOrFiles?: 'commits' | 'files';
  minAuthorDate?: number;
  maxAuthorDate?: number;
  authors?: number;
  commits?: number;
  files?: number;
  linesAdded?: number;
  linesDeleted?: number;
}

export class Stats extends Component<StatsProps & DispatchProps> {
  render() {
    return (
      <div style={style('panel', 'flexRows')}>
        <StackedLabelHeader label="Contributors">
          <CommaNumber value={this.props.authors} />
        </StackedLabelHeader>
        <StackedLabelHeader label="Active Time Span">
          <EpochSpan
            firstEpochTime={this.props.minAuthorDate}
            secondEpochTime={this.props.maxAuthorDate}
          />
        </StackedLabelHeader>
        <StackedLabelHeader label="Lines Added">
          <CommaNumber value={this.props.linesAdded} />
        </StackedLabelHeader>
        <StackedLabelHeader label="Lines Deleted">
          <CommaNumber value={this.props.linesDeleted} />
        </StackedLabelHeader>
        <StackedLabelHeader
          label="Commits"
          title="Click to view Commits"
          isSelected={this.props.viewCommitsOrFiles === 'commits'}
          onLabelClick={this.onCommitsClicked}
        >
          <CommaNumber value={this.props.commits} />
        </StackedLabelHeader>
        <StackedLabelHeader
          label="Files"
          title="Click to view Files"
          onLabelClick={this.onFilesClicked}
          isSelected={this.props.viewCommitsOrFiles === 'files'}
        >
          <CommaNumber value={this.props.files} />
        </StackedLabelHeader>
      </div>
    );
  }
  onCommitsClicked = () => {
    this.props.dispatch(viewCommits());
  };
  onFilesClicked = () => {
    this.props.dispatch(viewFiles());
  };
}

export const mapStateToProps = state => {
  return getFilteredStats(state);
};

export default connect(mapStateToProps)(Stats);
