import React from 'react';
// @ts-ignore
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { style } from 'app/styles';

import {
  getEndDate,
  getDiffLeftCommit,
  getDiffRightCommit,
  getSelectedPath,
} from 'app/selectors/stateVars';
import {
  getCommitsForTimeplot,
  getFilteredCommits,
} from 'app/selectors/commits';
import { setDates } from 'app/actions/setDates';

import { RevSelector } from 'app/components/RevSelector';
import { EpochDateTime } from 'app/components/EpochDateTime';
import { fetchDiff } from 'app/actions/diff';

const outerStyle = {
  _extends: ['flexRow'],
  flexGrow: 0,
  flexShrink: 0,
  background: '@colors.altBackground',
  color: '@colors.altForeground',
};

const revSelectorStyle = {
  flexGrow: 1,
  textAlign: 'center',
};

export const DifferenceViewerHeader: React.FC = (): React.ReactElement => {
  const selectedPath = useSelector(getSelectedPath);
  const leftCommit = useSelector(getDiffLeftCommit);
  const rightCommit = useSelector(getDiffRightCommit);
  const timeplotCommits = useSelector(getCommitsForTimeplot);
  const dispatch = useDispatch();

  return (
    <div style={style(outerStyle)}>
      <RevSelector
        style={style(revSelectorStyle)}
        disablePrevious={shouldDisablePrevious(leftCommit)}
        disableNext={shouldDisableNext(leftCommit)}
        onNextRevClick={onLeftRevNext}
        onPreviousRevClick={onLeftRevPrevious}
      >
        {renderRevChildren('left', leftCommit)}
      </RevSelector>
      <RevSelector
        style={style(revSelectorStyle)}
        disablePrevious={shouldDisablePrevious(rightCommit)}
        disableNext={shouldDisableNext(rightCommit)}
        onNextRevClick={onRightRevNext}
        onPreviousRevClick={onRightRevPrevious}
      >
        {renderRevChildren('right', rightCommit)}
      </RevSelector>
    </div>
  );

  function renderRevChildren(which, _commit) {
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return null;
    }
    const commit = which === 'left' && !_commit ? timeplotCommits[0] : _commit;

    return (
      <div style={style('flexColumn', { alignItems: 'center' })}>
        {commit ? (
          <>
            <div style={style('flexRow')}>
              <EpochDateTime value={commit.authorDate} />
            </div>
            <div style={style('flexRow')}>
              (#
              {commit.hash})
              {commit.id === timeplotCommits[0].id && ' (Local HEAD)'}
            </div>
          </>
        ) : (
          <div style={style('flexRow')}>Uncommitted Changes</div>
        )}
      </div>
    );
  }

  function shouldDisablePrevious(commit) {
    if (!timeplotCommits) {
      return true;
    }
    // a null left or right commit means it's the local changes
    // or the HEAD rev and there should be previous commits
    return (
      (commit && commit === timeplotCommits[timeplotCommits.length - 1]) ||
      (commit && commit === rightCommit && rightCommit === leftCommit)
    );
  }
  function shouldDisableNext(commit) {
    // a null commit means it's the latest rev
    if (!timeplotCommits || !commit) {
      return true;
    }
    return (
      commit === timeplotCommits[0] ||
      (commit === leftCommit && rightCommit === leftCommit)
    );
  }

  function onLeftRevPrevious() {
    setLeftRev(-1);
  }

  function onLeftRevNext() {
    setLeftRev(1);
  }

  function setLeftRev(relativeIndex) {
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return;
    }
    let newLeftCommit = timeplotCommits[0];
    if (leftCommit) {
      const foundIndex = timeplotCommits.findIndex(commit => {
        return commit.id === leftCommit.id;
      });
      if (foundIndex !== -1) {
        newLeftCommit = timeplotCommits[foundIndex + relativeIndex];
      }
    }
    dispatch(fetchDiff(selectedPath, newLeftCommit, rightCommit));
  }

  function onRightRevPrevious() {
    setRightRev(-1);
  }

  function onRightRevNext() {
    setRightRev(1);
  }

  function setRightRev(relativeIndex) {
    if (!timeplotCommits || timeplotCommits.length === 0) {
      return;
    }
    let newRightCommit = null;
    if (rightCommit) {
      const foundIndex = timeplotCommits.findIndex(commit => {
        return commit.id === leftCommit.id;
      });
      if (foundIndex !== -1) {
        newRightCommit = timeplotCommits[foundIndex + relativeIndex];
      }
    }
    dispatch(fetchDiff(selectedPath, leftCommit, newRightCommit));
  }
};
