import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { getHeaderContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';
import { setDates } from 'app/actions/setDates';
import { EpochDateTime } from 'app/components/EpochDateTime';
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';

import { ResetLink } from 'app/components/ResetLink';

const outerStyle = {
  _extends: ['flexColumn'],
  flexShrink: 0,
};

const appNameStyle = {
  _extends: ['inlineBlock', 'h1Text'],
  marginBottom: 10,
};

const topRowStyle = {
  _extends: 'flexRow',
};

const statsAndSearchStyle = {
  _extends: ['inlineBlock', 'flexColumn'],
  marginBottom: 10,
  flexGrow: 1,
};

const dateStyle = {
  transition: 'all 2s ease -in -out',
};

const dateSelectedStyle = {
  _extends: 'h2Text',
  margin: '0px 5px',
  color: '@colors.selected',
};

const dateOptions = {
  month: 'long',
  timeZoneName: 'short',
};

export const Header: React.FC = (): React.ReactElement => {
  const state = useSelector(getHeaderContainerState);
  const dispatch = useDispatch();

  const epochStyle = [dateStyle, state.isDefaultDates ? {} : dateSelectedStyle];
  return (
    <div style={style(outerStyle)}>
      <div style={style(topRowStyle)}>
        <div style={style(appNameStyle)}>Git Temporal </div>
        <div style={style('flexGrow')} />
        <div style={style('h5Text')}>
          From{' '}
          <ExplodeOnChange value={state.startDate}>
            <EpochDateTime
              value={state.startDate}
              displayOptions={dateOptions}
              style={style(epochStyle)}
            />
          </ExplodeOnChange>{' '}
          to{' '}
          <ExplodeOnChange value={state.endDate}>
            <EpochDateTime
              value={state.endDate}
              displayOptions={dateOptions}
              style={style(epochStyle)}
            />
          </ExplodeOnChange>
          {!state.isDefaultDates && (
            <span>
              {'  '}(<ResetLink onClick={onResetDatesClick}>Reset</ResetLink>)
            </span>
          )}
        </div>
      </div>
      <div style={style(statsAndSearchStyle)}>
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
    const { selectedPath } = state;
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
    const { selectedPath, commits } = state;
    setDates(dispatch, commits, selectedPath, null, null);
  }
};
