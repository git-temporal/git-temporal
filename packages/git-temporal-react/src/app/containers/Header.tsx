import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, IHeaderContainerState } from 'app/interfaces';
import { getHeaderContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath, setStartDate, setEndDate } from 'app/actions';
import { EpochDateTime } from 'app/components/EpochDateTime';
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';

import Search from 'app/containers/Search';

const outerStyle = {
  _extends: ['panel', 'flexColumns'],
  flexShrink: 0,
};

const appNameStyle = {
  _extends: ['inlineBlock', 'h1Text'],
  marginBottom: 10,
};

const topRowStyle = {
  _extends: 'flexRows',
  maxWidth: 1100,
};

const statsAndSearchStyle = {
  _extends: ['inlineBlock', 'flexColumns'],
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

export class Header extends Component<IHeaderContainerState & DispatchProps> {
  render() {
    const { startDate, endDate, isDefaultDates } = this.props;
    const epochStyle = [dateStyle, isDefaultDates ? {} : dateSelectedStyle];
    return (
      <div style={style(outerStyle)}>
        <div style={style(topRowStyle)}>
          <div style={style(appNameStyle)}>Git Temporal </div>
          <div style={style(statsAndSearchStyle)}>
            <div>
              <Search />
              <div style={style('h2Text', { marginBottom: 10 })}>
                Stats for {this.renderPathLinks()}
              </div>
            </div>
          </div>
        </div>
        <div style={style('h5Text')}>
          From{' '}
          <ExplodeOnChange value={startDate}>
            <EpochDateTime
              value={startDate}
              displayOptions={dateOptions}
              style={style(epochStyle)}
            />
          </ExplodeOnChange>{' '}
          to{' '}
          <ExplodeOnChange value={endDate}>
            <EpochDateTime
              value={endDate}
              displayOptions={dateOptions}
              style={style(epochStyle)}
            />
          </ExplodeOnChange>
          {!isDefaultDates && (
            <span>
              {'  '}(
              <span style={style('link')} onClick={this.onResetDatesClick}>
                reset
              </span>
              )
            </span>
          )}
        </div>
      </div>
    );
  }
  renderLinkPart(part, index, fullPath, lastIndex) {
    const styles: any = [
      {
        margin: '0px 2px',
      },
    ];
    let onClick = undefined;
    if (index !== lastIndex) {
      styles.push('link');
      onClick = () => this.onLinkPartClick(fullPath);
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
  renderPathLinks() {
    const { selectedPath } = this.props;
    let parts = ['repository:/'];
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
      return this.renderLinkPart(part, index, fullPathSoFar, lastIndex);
    });
  }

  onLinkPartClick = fullPath => {
    this.props.dispatch(selectPath(fullPath));
  };

  onResetDatesClick = () => {
    this.props.dispatch(setStartDate(null));
    this.props.dispatch(setEndDate(null));
  };
}

export default connect(getHeaderContainerState)(Header);
