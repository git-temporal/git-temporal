import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getFilteredStats } from 'app/selectors';
import { style } from 'app/styles';
import { StackedHeaderText } from 'app/components/StackedHeaderText';

interface StatsProps {
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
        <StackedHeaderText
          label="Contributors"
          text={this.props.authors.toString()}
        />
        <StackedHeaderText
          label="Active Time Span"
          text={`${this.props.minAuthorDate} - ${this.props.maxAuthorDate}`}
        />
        <StackedHeaderText
          label="Lines Added"
          text={this.props.linesAdded.toString()}
        />
        <StackedHeaderText
          label="Lines Deleted"
          text={this.props.linesDeleted.toString()}
        />
        <StackedHeaderText
          label="Commits"
          text={this.props.commits.toString()}
        />
        <StackedHeaderText label="Files" text={this.props.files.toString()} />
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return getFilteredStats(state);
};

export default connect(mapStateToProps)(Stats);
