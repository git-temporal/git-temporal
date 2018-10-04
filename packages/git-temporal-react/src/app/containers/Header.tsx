import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { getSelectedPath } from 'app/selectors';
import { style } from 'app/styles';

interface HeaderProps {
  // If not provided, the whole repository is assumed
  selectedPath?: string;
}

export class Header extends Component<
  HeaderProps & DispatchProps & StateProps
> {
  render() {
    const { selectedPath } = this.props;

    return (
      <div style={style('panel')}>
        <span style={style('h1Text')}>Git Temporal </span>
        <span style={style('h2Text')}>Stats for {selectedPath}</span>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  selectedPath: getSelectedPath(state),
});

export default connect(mapStateToProps)(Header);
