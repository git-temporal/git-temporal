import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { DispatchProps } from 'app/interfaces';
import { getStatsContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { StackedLabel } from 'app/components/StackedLabel';
import { CommaNumber } from 'app/components/CommaNumber';
import { EpochSpan } from 'app/components/EpochSpan';
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';

interface StatsProps {
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
  _extends: ['flexColumns'],
  paddingBottom: 0,
  flexShrink: 0,
};

export class Stats extends Component<StatsProps & DispatchProps> {
  componentWillUnmount() {
    debug('unmounting Stats');
  }

  render() {
    return (
      <div style={style(outerStyle)}>
        <StackedLabel label="Active Time Span">
          <ExplodeOnChange
            value={this.props.minAuthorDate + this.props.maxAuthorDate}
          >
            <EpochSpan
              firstEpochTime={this.props.minAuthorDate}
              secondEpochTime={this.props.maxAuthorDate}
            />
          </ExplodeOnChange>
        </StackedLabel>
        <StackedLabel label="Last Commit">
          <div>
            <ExplodeOnChange value={this.props.maxAuthorDate}>
              <EpochSpan
                firstEpochTime={this.props.maxAuthorDate}
                secondEpochTime={Date.now() / 1000}
              />
              <span> ago</span>
            </ExplodeOnChange>
          </div>
        </StackedLabel>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return getStatsContainerState(state);
};

export default connect(mapStateToProps)(Stats);
