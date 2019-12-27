import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { handleVscodeMessages } from 'app/actions/vscode';
import { getGitTemporalContainerState } from 'app/selectors';
import { style } from 'app/styles';

import { Header } from 'app/containers/Header';
import { DifferenceViewer } from 'app/containers/DifferenceViewer';
import Timeplot from 'app/containers/Timeplot';

import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { TransitionVisible } from 'app/components/TransitionVisible';
import { SidePanel } from './containers/SidePanel';

const transitionStyle = {
  _extends: 'flexColumn',
  flexGrow: 1,
  overflow: 'hidden',
};

const mainContainerStyle = {
  height: '100%',
  overflow: 'scroll',
};

export class GitTemporal extends Component<
  GitTemporalProps & DispatchProps & StateProps
> {
  componentDidMount() {
    const { path, dispatch } = this.props;
    dispatch(selectPath(path));
    handleVscodeMessages(dispatch);
  }

  componentWillUnmount() {
    debug('unmounting GitTemporal');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      const { dispatch, path } = nextProps;
      dispatch(selectPath(path));
    }
  }

  render() {
    const { isFetching } = this.props;
    debug('rendering GitTemporal');

    return (
      <div style={style('page')}>
        <SpinnerContainer isSpinning={isFetching}>
          <div style={style('flexColumn', mainContainerStyle)}>
            <Header />
            <TransitionVisible
              isVisible={!isFetching}
              style={style(transitionStyle)}
            >
              <div
                style={style('flexRow', 'flexGrow', {
                  overflow: 'visible',
                  height: '100%',
                })}
              >
                <SidePanel />
                <div
                  style={style('flexColumn', 'flexGrow', {
                    transition: `all .5 ease`,
                    overflow: 'hidden',
                  })}
                >
                  <DifferenceViewer />
                  <Timeplot />
                </div>
              </div>
            </TransitionVisible>
          </div>
        </SpinnerContainer>
      </div>
    );
  }
}

export default connect(getGitTemporalContainerState)(GitTemporal);
