import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getHeaderContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';

interface HeaderProps {
  // If not provided, the whole repository is assumed
  selectedPath?: string;
  filteredAuthors?: string[];
}

export class Header extends Component<HeaderProps & DispatchProps> {
  render() {
    return (
      <div style={style('panel', 'flexColumns')}>
        <div style={style('flexRows')}>
          <div style={style('inlineBlock', 'h1Text')}>Git Temporal </div>
          <div
            style={style('inlineBlock', 'flexColumns', {
              marginBottom: 20,
            })}
          >
            <div style={style('h2Text', { marginBottom: 10 })}>
              Stats for {this.renderPathLinks()}
            </div>
            <div style={style('normalText')}>{this.renderAuthors()}</div>
          </div>
        </div>
        <div style={style('h5Text')}>
          From January 18, 2014 18:06 GMT to January 19, 2014 18:06 GMT
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

  renderAuthors() {
    const { filteredAuthors } = this.props;
    if (!filteredAuthors || filteredAuthors.length <= 0) {
      return null;
    }
    return `Showing commits by ${filteredAuthors.join(', ')}`;
  }

  onLinkPartClick = fullPath => {
    this.props.dispatch(selectPath(fullPath));
  };
}

export default connect(getHeaderContainerState)(Header);
