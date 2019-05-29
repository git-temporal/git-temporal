import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { DispatchProps } from 'app/interfaces';
import { getStatsContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { StackedLabelHeader } from 'app/components/StackedLabelHeader';
import { CommaNumber } from 'app/components/CommaNumber';
import { EpochSpan } from 'app/components/EpochSpan';
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';

import { viewCommits, viewFiles } from 'app/actions';

export enum CommitsOrFiles {
  COMMITS = 'commits',
  FILES = 'files',
}
interface StatsProps {
  viewCommitsOrFiles?: CommitsOrFiles;
  minAuthorDate?: number;
  maxAuthorDate?: number;
  authors?: number;
  commits?: number;
  files?: number;
  linesAdded?: number;
  linesDeleted?: number;
  isFileSelected?: boolean;
}

const outerStyle = {
  _extends: ['panel', 'flexRows'],
  paddingBottom: 0,
  marginBottom: -10,
  flexShrink: 0,
};

export class Stats extends Component<StatsProps & DispatchProps> {
  componentDidMount() {
    this.viewCommitsIfIsFile();
  }

  componentWillUnmount() {
    debug('unmounting Stats');
  }

  componentDidUpdate() {
    this.viewCommitsIfIsFile();
  }

  render() {
    const onFilesClick = this.props.files === 1 ? null : this.onFilesClick;
    return (
      <div style={style(outerStyle)}>
        <StackedLabelHeader label="Authors">
          <ExplodeOnChange value={this.props.authors}>
            <CommaNumber value={this.props.authors} />
          </ExplodeOnChange>
        </StackedLabelHeader>
        <StackedLabelHeader label="Active Time Span">
          <ExplodeOnChange
            value={this.props.minAuthorDate + this.props.maxAuthorDate}
          >
            <EpochSpan
              firstEpochTime={this.props.minAuthorDate}
              secondEpochTime={this.props.maxAuthorDate}
            />
          </ExplodeOnChange>
        </StackedLabelHeader>
        <StackedLabelHeader label="Last Commit">
          <div>
            <ExplodeOnChange value={this.props.maxAuthorDate}>
              <EpochSpan
                firstEpochTime={this.props.maxAuthorDate}
                secondEpochTime={Date.now() / 1000}
              />
              <span> ago</span>
            </ExplodeOnChange>
          </div>
        </StackedLabelHeader>
        <StackedLabelHeader label="Lines Added">
          <ExplodeOnChange value={this.props.linesAdded}>
            <CommaNumber value={this.props.linesAdded} />
          </ExplodeOnChange>
        </StackedLabelHeader>
        <StackedLabelHeader label="Lines Deleted">
          <ExplodeOnChange value={this.props.linesDeleted}>
            <CommaNumber value={this.props.linesDeleted} />
          </ExplodeOnChange>
        </StackedLabelHeader>
        <StackedLabelHeader
          label="Commits"
          title="Click to view Commits"
          isSelected={this.props.viewCommitsOrFiles === 'commits'}
          onLabelClick={this.onCommitsClick}
        >
          <ExplodeOnChange value={this.props.commits}>
            <CommaNumber value={this.props.commits} />
          </ExplodeOnChange>
        </StackedLabelHeader>
        <StackedLabelHeader
          label="Files"
          title="Click to view Files"
          onLabelClick={onFilesClick}
          isSelected={this.props.viewCommitsOrFiles === 'files'}
        >
          <ExplodeOnChange value={this.props.files}>
            <CommaNumber value={this.props.files} />
          </ExplodeOnChange>
        </StackedLabelHeader>
      </div>
    );
  }
  onCommitsClick = () => {
    this.props.dispatch(viewCommits());
  };
  onFilesClick = () => {
    this.props.dispatch(viewFiles());
  };

  viewCommitsIfIsFile() {
    const { dispatch, viewCommitsOrFiles } = this.props;
    const isFileSelected = this.props.files === 1;
    if (isFileSelected && viewCommitsOrFiles === 'files') {
      dispatch(viewCommits());
    }
  }
}

export const mapStateToProps = state => {
  return getStatsContainerState(state);
};

export default connect(mapStateToProps)(Stats);
