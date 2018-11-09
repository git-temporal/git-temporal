import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, IHeaderContainerState } from 'app/interfaces';
import { getHeaderContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath, setStartDate, setEndDate } from 'app/actions';
import { EpochDateTime } from 'app/components/EpochDateTime';

import Search from 'app/containers/Search';

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

const datesSelectedStyle = {
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
    const epochStyle = isDefaultDates ? {} : datesSelectedStyle;
    return (
      <div style={style('panel', 'flexColumns')}>
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
          <EpochDateTime
            value={startDate}
            displayOptions={dateOptions}
            style={style(epochStyle)}
          />{' '}
          to{' '}
          <EpochDateTime
            value={endDate}
            displayOptions={dateOptions}
            style={style(epochStyle)}
          />
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
