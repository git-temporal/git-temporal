import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import {
  getFilteredCommits,
  getAreCommitsFiltered,
} from 'app/selectors/commits';
import { getSelectedPath } from 'app/selectors/stateVars';
import {
  getDefaultedStartDate,
  getDefaultedEndDate,
} from 'app/selectors/dates';

import { style } from 'app/styles';
import { selectPath } from 'app/actions';
import { setDates } from 'app/actions/setDates';
import { Search } from 'app/containers/Search';
import { ExplodingDateRange } from 'app/components/ExplodingDateRange';
import { ResetLink } from 'app/components/ResetLink';

const styles = {
  outer: {
    _extends: ['flexColumn'],
    flexShrink: 0,
  },
  appName: {
    _extends: ['inlineBlock', 'h1Text'],
    marginBottom: 10,
  },
  dateRange: {
    _extends: ['flexGrow', 'flexColumn'],
    alignItems: 'center',
    paddingTop: '@margins.small+px',
    paddingLeft: '@margins.large+px',
  },
  topRow: {
    _extends: 'flexRow',
  },
  date: {
    transition: 'all 2s ease -in -out',
  },
  dateSelected: {
    _extends: 'h2Text',
    margin: '0px 5px',
    color: '@colors.selected',
  },
  path: {
    _extends: ['inlineBlock', 'flexColumn'],
    marginBottom: 10,
    flexGrow: 1,
  },
  searchAndReset: {
    _extends: 'flexColumn',
    alignItems: 'flex-end',
    marginRight: '@margins.medium+px',
  },
};

export const Header: React.FC = (): React.ReactElement => {
  const selectedPath = useSelector(getSelectedPath);
  const commits = useSelector(getFilteredCommits);
  const startDate = useSelector(getDefaultedStartDate);
  const endDate = useSelector(getDefaultedEndDate);
  const areCommitsFiltered = useSelector(getAreCommitsFiltered);

  const dispatch = useDispatch();

  return (
    <div style={style(styles.outer)}>
      <div style={style(styles.topRow)}>
        <div style={style(styles.appName)}>Git Temporal </div>
        <div style={style(styles.dateRange)}>
          <ExplodingDateRange
            {...{ startDate, endDate, isDefaultDates: !areCommitsFiltered }}
          />
        </div>
        <div style={style(styles.searchAndReset)}>
          <Search />
          {areCommitsFiltered && (
            <ResetLink onClick={onResetDatesClick}>
              Reset Filters & Dates
            </ResetLink>
          )}
        </div>
      </div>
      <div style={style(styles.path)}>
        <div>
          <div style={style('h4Text', { marginBottom: 10 })}>
            {renderPathLinks()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderLinkPart(part, index, fullPath, lastIndex) {
    const styles: any = [
      {
        margin: '0px 2px',
      },
    ];
    let onClick = undefined;
    if (index !== lastIndex) {
      styles.push('link');
      onClick = () => onLinkPartClick(fullPath);
    }
    const sep = index === 0 ? '' : '/';

    return (
      <span style={{ wordBreak: 'break-all' }}>
        {sep}
        <span style={style(styles)} key={index} onClick={onClick}>
          {part}
        </span>
      </span>
    );
  }
  function renderPathLinks() {
    let parts = ['(repo root)/'];
    if (selectedPath && selectedPath.trim().length > 0) {
      parts = parts.concat(selectedPath.split('/'));
    }
    const lastIndex = parts.length - 1;
    let fullPathSoFar = '';
    return parts.map((part, index) => {
      // > 1 means don't add 'repository:'
      if (index > 0) {
        const sep = index === 1 ? '' : '/';
        fullPathSoFar += `${sep}${part}`;
      }
      return renderLinkPart(part, index, fullPathSoFar, lastIndex);
    });
  }

  function onLinkPartClick(fullPath) {
    dispatch(selectPath(fullPath));
  }

  function onResetDatesClick() {
    setDates(dispatch, commits, selectedPath, null, null);
  }
};
