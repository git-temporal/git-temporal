import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debug } from 'app/utilities/logger';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { handleVscodeMessages } from 'app/actions/vscode';
import { getGitTemporalContainerState } from 'app/selectors';
import { style, getStyleVar } from 'app/styles';

import { Header } from 'app/containers/Header';
import { DifferenceViewer } from 'app/containers/DifferenceViewer';
import Timeplot from 'app/containers/Timeplot';

import { SidePanel } from './containers/SidePanel';

const pageStyle = () => {
  const pageMarginTop = getStyleVar('margins', 'pageTop');
  const pageMarginLeft = getStyleVar('margins', 'pageLeft');
  const pageMarginBottom = getStyleVar('margins', 'pageBottom');
  const pageMarginRight = getStyleVar('margins', 'pageRight');

  return {
    paddingTop: `${pageMarginTop}px`,
    paddingLeft: `${pageMarginLeft}px`,
    paddingBottom: `${pageMarginBottom}px`,
    paddingRight: `${pageMarginRight}px`,

    width: `calc(100% - ${pageMarginLeft + pageMarginRight}px)`,
    height: `calc(100% - ${pageMarginTop + pageMarginBottom}px)`,
    position: 'absolute',
    backgroundColor: '@colors.background',
  };
};

const transitionStyle = {
  _extends: 'flexColumn',
  flexGrow: 1,
  overflow: 'hidden',
};

const mainContainerStyle = {
  height: '100%',
  overflow: 'hidden',
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

  componentDidUpdate(prevProps) {
    const { dispatch, path } = this.props;
    if (prevProps.path !== path) {
      dispatch(selectPath(path));
    }
  }

  render() {
    debug('rendering GitTemporal');

    return (
      <div style={style(pageStyle())}>
        <div style={style('flexColumn', mainContainerStyle)}>
          <Header />
          <div
            style={style('flexRow', 'flexGrow', {
              overflow: 'hidden',
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
        </div>
      </div>
    );
  }
}

export default connect(getGitTemporalContainerState)(GitTemporal);
