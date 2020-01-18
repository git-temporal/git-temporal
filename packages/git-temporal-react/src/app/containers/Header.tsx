import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { debug } from 'app/utilities/logger';
import {
  getAreCommitsFiltered,
  getFilteredCommits,
} from 'app/selectors/commits';
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
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';
import { EpochDateTime } from 'app/components/EpochDateTime';

const styles = {
  outer: {
    _extends: ['flexColumn'],
    flexShrink: 0,
  },
  appName: {
    _extends: ['inlineBlock', 'h1Text'],
    marginBottom: 10,
  },
  date: {
    _extends: 'largerText',
  },
  dateSelected: {
    _extends: 'bigText',
    color: '@colors.selected',
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
  path: {
    _extends: ['inlineBlock', 'flexColumn'],
    marginBottom: 10,
    flexGrow: 1,
    minHeight: 30,
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
  const filteredCommits = useSelector(getFilteredCommits);
  const gitRoot = useSelector(getGitRoot);

  const dispatch = useDispatch();

  const dateStyle = style([
    styles.date,
    areCommitsFiltered && styles.dateSelected,
  ]);
  const singleCommit =
    areCommitsFiltered && filteredCommits.length === 1 && filteredCommits[0];

  return (
    <div style={style(styles.outer)}>
      <div style={style(styles.topRow)}>
        <div style={style(styles.appName)}>Git Temporal </div>
        <div style={style(styles.dateRange)}>
          {filteredCommits.length === 0 ? (
            <div />
          ) : singleCommit ? (
            <ExplodeOnChange
              value={singleCommit.authorDate}
              style={dateStyle}
              initialExplosion
            >
              Single commit (#
              {singleCommit.hash}) on{' '}
              <EpochDateTime
                value={singleCommit.authorDate}
                style={dateStyle}
              />
            </ExplodeOnChange>
          ) : (
            <ExplodingDateRange
              startDate={startDate}
              endDate={endDate}
              style={dateStyle}
            />
          )}
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
    debug('renderPathLinks', { selectedPath, gitRoot });
    if (!gitRoot || gitRoot.length === 0) {
      return null;
    }
    let parts = ['(repository root)'];
    debug('renderPathLinks', { selectedPath, gitRoot });
    if (selectedPath && selectedPath.trim().length > 0) {
      // in vscode it sends us the full path so trim off repo root
      const relativePath = selectedPath.startsWith(gitRoot)
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
