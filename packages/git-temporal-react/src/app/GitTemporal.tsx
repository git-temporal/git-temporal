import React, { Component } from 'react';
import { connect } from 'react-redux';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { getFilteredCommitsState } from 'app/selectors';
import { style } from 'app/styles';

import Header from 'app/containers/Header';
import Stats from 'app/containers/Stats';
import Authors from 'app/containers/Authors';
import Files from 'app/containers/Files';
import Commits from 'app/containers/Commits';

import { SpinnerContainer } from 'app/components/SpinnerContainer';

export class GitTemporal extends Component<
  GitTemporalProps & DispatchProps & StateProps
> {
  componentDidMount() {
    const { path, dispatch } = this.props;
    dispatch(selectPath(path));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      const { dispatch, path } = nextProps;
      dispatch(selectPath(path));
    }
  }

  render() {
    const { isFetching, viewCommitsOrFiles, commits } = this.props;

    return (
      <div style={style('page')}>
        {!isFetching && (!commits || commits.length <= 0) ? (
          <h2>Empty.</h2>
        ) : (
          <SpinnerContainer isSpinning={isFetching}>
            <div
              style={style('flexColumns', {
                height: '100%',
              })}
            >
              <Header />
              {isFetching ? null : (
                <div style={style('flexColumns', { flexGrow: 1 })}>
                  <Stats />
                  <div style={style('flexRows', { flexGrow: 1 })}>
                    <Authors />
                    {viewCommitsOrFiles === 'files' ? <Files /> : <Commits />}
                  </div>
                </div>
              )}
            </div>
          </SpinnerContainer>
        )}
      </div>
    );
  }
}
// debugger;
export function mapStateToProps(state) {
  return getFilteredCommitsState(state);
}

export default connect(mapStateToProps)(GitTemporal);
