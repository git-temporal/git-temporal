import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { style } from 'app/styles';

import {
  getStartDate,
  getEndDate,
  getSelectedPath,
} from 'app/selectors/stateVars';
import {
  getCommitsForTimeplot,
  getFilteredCommits,
} from 'app/selectors/commits';
import { setDates } from 'app/actions/setDates';

import { RevSelector } from 'app/components/RevSelector';
import { EpochDateTime } from 'app/components/EpochDateTime';

const outerStyle = {
  _extends: 'flexRow',
  flexGrow: 0,
  flexShrink: 0,
  marginBottom: '@margins.small+px',
  borderBottom: '1px solid @colors.panelBorder',
};

const revSelectorStyle = {
  flexGrow: 1,
  textAlign: 'center',
};

export const DifferenceViewerHeader: React.FC = (): React.ReactElement => {
  const selectedPath = useSelector(getSelectedPath);
  const startDate = useSelector(getStartDate);
  const endDate = useSelector(getEndDate);
  const timeplotCommits = useSelector(getCommitsForTimeplot);
  const filteredCommits = useSelector(getFilteredCommits);
  const dispatch = useDispatch();

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
        onNextRevClick={onLeftRevNext}
        onPreviousRevClick={onLeftRevPrevious}
      >
        {renderLeftRevChildren()}
      </RevSelector>
      <RevSelector
        style={style(revSelectorStyle)}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
        onNextRevClick={onRightRevNext}
        onPreviousRevClick={onRightRevPrevious}
      >
        {renderRightRevChildren()}
      </RevSelector>
    </div>
  );

  function renderLeftRevChildren() {
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return null;
    }
    // reminder: commits are in descending cron order
    const startingCommit = getStartingCommit();
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
          {startingCommit.id === timeplotCommits[0].id && ' (Local HEAD)'}
        </div>
      </div>
    );
  }

  function renderRightRevChildren() {
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
        <div>
          <EpochDateTime value={latestCommit.authorDate} />
        </div>
        <div>#{latestCommit.hash}</div>
      </>
    ) : (
      <span>Local Revision</span>
    );
  }

  function onLeftRevPrevious() {
    setLeftRev(-1);
  }

  function onLeftRevNext() {
    setLeftRev(1);
  }

  function setLeftRev(relativeIndex) {
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
        selectedPath,
        timeplotCommits,
        startDate,
        endDate,
        false,
        adjacentCommit.authorDate * 1000
      );
    }
  }

  function onRightRevPrevious() {
    setRightRev(-1);
  }

  function onRightRevNext() {
    setRightRev(1);
  }

  function setRightRev(relativeIndex) {
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
        selectedPath,
        timeplotCommits,
        startDate,
        endDate,
        true,
        adjacentCommit.authorDate * 1000
      );
    }
  }
  // starting commit is the last effective commit that comes before the set start date
  function getStartingCommit() {
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return null;
    }
    if (!filteredCommits || filteredCommits.length === 0) {
      return timeplotCommits[timeplotCommits.length - 1];
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
};
