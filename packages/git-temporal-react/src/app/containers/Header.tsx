import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { debug } from 'app/utilities/logger';
import { getAreCommitsFiltered } from 'app/selectors/commits';
import { getSelectedPath, getGitRoot } from 'app/selectors/stateVars';
import {
  getDefaultedStartDate,
  getDefaultedEndDate,
} from 'app/selectors/dates';

import { style } from 'app/styles';
import { selectPath, setSearch } from 'app/actions';
import { setDates } from 'app/actions/setDates';
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
    alignItems: 'flex-end',
    paddingTop: '@margins.small+px',
    paddingRight: '@margins.large+px',
  },
  topRow: {
    _extends: 'flexRow',
  },
  date: {
    transition: 'all 2s ease -in -out',
  },
  path: {
    _extends: ['inlineBlock', 'flexColumn'],
    marginBottom: 10,
    flexGrow: 1,
  },
  resetLink: {
    position: 'relative',
    top: '-5px',
  },
  pathPart: {
    extends: 'smallerText',
    margin: '0px 2px',
  },
  pathSeparator: {
    color: '@colors.linkText',
    wordBreak: 'break-all ',
  },
};

export const Header: React.FC = (): React.ReactElement => {
  const selectedPath = useSelector(getSelectedPath);
  const startDate = useSelector(getDefaultedStartDate);
  const endDate = useSelector(getDefaultedEndDate);
  const areCommitsFiltered = useSelector(getAreCommitsFiltered);
  const gitRoot = useSelector(getGitRoot);

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
      </div>
      <div style={style('flexRow')}>
        <div style={style(styles.path)}>
          <div>
            <div style={style('h4Text', { marginBottom: 10 })}>
              {renderPathLinks()}
            </div>
          </div>
        </div>
        {areCommitsFiltered && (
          <ResetLink
            style={style(styles.resetLink)}
            onClick={onResetDatesClick}
          >
            Reset Date Range
          </ResetLink>
        )}
      </div>
    </div>
  );

  function renderLinkPart(part, index, fullPath, lastIndex) {
    const partStyles: any = [styles.pathPart];
    let onClick = undefined;
    if (index !== lastIndex) {
      partStyles.push('link');
      onClick = () => onLinkPartClick(fullPath);
    }
    const sep = index > 1 ? '/' : index > 0 ? ' : ' : '';

    return (
      <span>
        <span style={style(styles.pathSeparator)}>{sep}</span>
        <span style={style(partStyles)} key={index} onClick={onClick}>
          {part}
        </span>
      </span>
    );
  }
  function renderPathLinks() {
    let parts = ['(repository root)'];
    console.log('renderPathLinks');
    debug('renderPathLinks', { selectedPath, gitRoot });
    if (selectedPath && selectedPath.trim().length > 0) {
      // in vscode it sends us the full path so trim off repo root
      const relativePath =
        gitRoot && selectedPath.startsWith(gitRoot)
          ? selectedPath.slice(gitRoot.length + 1)
          : selectedPath;
      parts = parts.concat(relativePath.trim().split(/[/\\]/));
    }

    const lastIndex = parts.length - 1;
    let fullPathSoFar = gitRoot || '';
    return parts.map((part, index) => {
      // > 0 means don't add 'repository:'
      if (index > 0) {
        fullPathSoFar += fullPathSoFar.length > 0 ? `/${part}` : part;
      }
      return renderLinkPart(part, index, fullPathSoFar, lastIndex);
    });
  }

  function onLinkPartClick(fullPath) {
    dispatch(selectPath(fullPath));
  }

  function onResetDatesClick() {
    dispatch(setDates(null, null));
    dispatch(setSearch(null));
  }
};
