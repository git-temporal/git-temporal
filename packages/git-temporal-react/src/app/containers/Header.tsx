import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getSelectedPath } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';

interface HeaderProps {
  // If not provided, the whole repository is assumed
  selectedPath?: string;
}

export class Header extends Component<HeaderProps & DispatchProps> {
  render() {
    return (
      <div style={style('panel')}>
        <span style={style('h1Text')}>Git Temporal </span>
        <span style={style('h2Text')}>Stats for {this.renderPathLinks()}</span>
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
      <span>
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
    if (selectedPath.trim().length > 0) {
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
}

export const mapStateToProps = state => ({
  selectedPath: getSelectedPath(state),
});

export default connect(mapStateToProps)(Header);
