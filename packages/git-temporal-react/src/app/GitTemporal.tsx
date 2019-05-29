import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { handleVscodeMessages } from 'app/actions/vscode';
import { getGitTemporalContainerState } from 'app/selectors';
import { style } from 'app/styles';

import Header from 'app/containers/Header';
import Stats from 'app/containers/Stats';
import Authors from 'app/containers/Authors';
import Files from 'app/containers/Files';
import Commits from 'app/containers/Commits';
import Timeplot from 'app/containers/Timeplot';
import DifferenceViewer from 'app/containers/DifferenceViewer';

import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { HorizontalScroller } from 'app/components/HorizontalScroller';
import { TransitionVisible } from 'app/components/TransitionVisible';

const outerScrollStyle = {
  _extends: 'flexRows',
  position: 'relative',
  minHeight: '100%',
  height: 'initial',
};

const innerScrollStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
};

const scrollerIconStyle = {
  transform: 'scaleY(8)',
  top: '35%',
};

const transitionStyle = {
  _extends: 'flexColumns',
  flexGrow: 1,
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
    const { isFetching, viewCommitsOrFiles } = this.props;
    debug('rendering GitTemporal');

    return (
      <div style={style('page')}>
        <SpinnerContainer isSpinning={isFetching}>
          <div style={style('flexColumns', { height: '100%' })}>
            <Header />
            <TransitionVisible
              isVisible={!isFetching}
              style={style(transitionStyle)}
            >
              <Stats />
              <div style={{ display: 'flex', flexGrow: 1 }}>
                <HorizontalScroller
                  style={style(outerScrollStyle)}
                  innerStyle={style(innerScrollStyle)}
                  iconStyle={style(scrollerIconStyle)}
                >
                  <Authors />
                  {viewCommitsOrFiles === 'files' ? <Files /> : <Commits />}
                  <DifferenceViewer />
                </HorizontalScroller>
              </div>
              <Timeplot />
            </TransitionVisible>
          </div>
        </SpinnerContainer>
      </div>
    );
  }
}

export default connect(getGitTemporalContainerState)(GitTemporal);
