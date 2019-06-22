import React, { Component } from 'react';
import { connect } from 'react-redux';
import { style } from 'app/styles';

import { DispatchProps, IDifferenceViewerHeaderState } from 'app/interfaces';
import { getDifferenceViewerHeaderState } from 'app/selectors';
import { setDates } from 'app/actions/setDates';

import { RevSelector } from 'app/components/RevSelector';
import { EpochDateTime } from 'app/components/EpochDateTime';

const outerStyle = {
  _extends: 'flexRow',
  flexGrow: 0,
  marginBottom: 10,
  paddingBottom: 10,
  marginTop: -10,
  borderBottom: '1px solid @colors.panelBorder',
  maxHeight: 30,
};

const revSelectorStyle = {
  flexGrow: 1,
  textAlign: 'center',
};

export class DifferenceViewerHeader extends Component<
  IDifferenceViewerHeaderState & DispatchProps
> {
  render() {
    const { timeplotCommits, startDate, endDate } = this.props;
    if (!timeplotCommits || timeplotCommits.length <= 0) {
      return null;
    }
    const disablePrevious =
      startDate && timeplotCommits[0].authorDate <= startDate;
    const disableNext = !endDate;

    return (
      <div style={style(outerStyle)}>
        <RevSelector
          style={style(revSelectorStyle)}
          disablePrevious={disablePrevious}
          disableNext={disableNext}
          onNextRevClick={this.onLeftRevNext}
          onPreviousRevClick={this.onLeftRevPrevious}
        >
          {this.renderLeftRevChildren()}
        </RevSelector>
        <RevSelector
          style={style(revSelectorStyle)}
          disablePrevious={disablePrevious}
          disableNext={disableNext}
          onNextRevClick={this.onRightRevNext}
          onPreviousRevClick={this.onRightRevPrevious}
        >
          {this.renderRightRevChildren()}
        </RevSelector>
      </div>
    );
  }

  renderLeftRevChildren() {
    const { startDate, timeplotCommits } = this.props;
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return null;
    }
    // reminder: commits are in descending cron order
    const startingCommit = this.getStartingCommit();
    if (!startingCommit) {
      return null;
    }
    return (
      <div style={style('flexColumn', { alignItems: 'center' })}>
        <div style={style('flexRow')}>
          <EpochDateTime value={startingCommit.authorDate} />
        </div>
        <div style={style('flexRow')}>
          #{startingCommit.hash}
          {!startDate && ' (Local HEAD)'}
        </div>
      </div>
    );
  }

  renderRightRevChildren() {
    const { endDate, filteredCommits } = this.props;
    if (!filteredCommits || filteredCommits.length === 0) {
      return null;
    }
    // reminder: commits are in descending cron order
    const latestCommit = filteredCommits[0];
    if (!latestCommit) {
      return null;
    }
    return endDate ? (
      <>
        <div>#{latestCommit.hash}</div>
        <div>
          <EpochDateTime value={latestCommit.authorDate} />
        </div>
      </>
    ) : (
      <span>Local Changes</span>
    );
  }

  onLeftRevPrevious = () => {
    this.setLeftRev(-1);
  };

  onLeftRevNext = () => {
    this.setLeftRev(1);
  };

  setLeftRev(relativeIndex) {
    const {
      dispatch,
      startDate,
      endDate,
      filteredCommits,
      timeplotCommits,
    } = this.props;
    if (!filteredCommits || filteredCommits.length === 0) {
      return;
    }
    if (!startDate && relativeIndex > 0) {
      return; // already at end
    }
    const foundIndex = startDate
      ? timeplotCommits.findIndex(commit => {
          return commit.id === filteredCommits[filteredCommits.length - 1].id;
        })
      : 0;
    const adjacentCommit = timeplotCommits[foundIndex - relativeIndex];
    if (adjacentCommit) {
      setDates(
        dispatch,
        startDate,
        endDate,
        false,
        adjacentCommit.authorDate * 1000
      );
    }
  }

  onRightRevPrevious = () => {
    this.setRightRev(-1);
  };

  onRightRevNext = () => {
    this.setRightRev(1);
  };

  setRightRev(relativeIndex) {
    const {
      dispatch,
      startDate,
      endDate,
      filteredCommits,
      timeplotCommits,
    } = this.props;
    if (!filteredCommits || filteredCommits.length === 0) {
      return;
    }
    if (!endDate && relativeIndex > 0) {
      return; // already at end
    }
    const latestFilteredCommit = endDate
      ? filteredCommits[0]
      : timeplotCommits[0];
    const foundIndex = timeplotCommits.findIndex(commit => {
      return commit.id === latestFilteredCommit.id;
    });
    const adjacentCommit = timeplotCommits[foundIndex - relativeIndex];
    if (adjacentCommit) {
      setDates(
        dispatch,
        startDate,
        endDate,
        true,
        adjacentCommit.authorDate * 1000
      );
    }
  }
  // starting commit is the last effective commit that comes before the set start date
  getStartingCommit() {
    const { startDate, filteredCommits, timeplotCommits } = this.props;
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return null;
    }
    if (!startDate || !filteredCommits || filteredCommits.length === 0) {
      return timeplotCommits[0];
    }
    // reminder: commits are in descending cron order
    const earliestFilteredCommit = filteredCommits[filteredCommits.length - 1];
    const foundIndex = timeplotCommits.findIndex(commit => {
      return commit.id === earliestFilteredCommit.id;
    });
    return timeplotCommits[
      Math.min(foundIndex + 1, filteredCommits.length - 1)
    ];
  }
}

export default connect(getDifferenceViewerHeaderState)(DifferenceViewerHeader);
