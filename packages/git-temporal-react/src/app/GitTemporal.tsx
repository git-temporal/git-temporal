import React, { Component } from 'react';
import { connect } from 'react-redux';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { getFilteredCommits } from 'app/selectors';
import { style } from 'app/styles';

import Header from 'app/containers/Header';
import Stats from 'app/containers/Stats';
import Authors from 'app/containers/Authors';

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
    const { isFetching, commits } = this.props;

    return (
      <div style={style('page')}>
        {isFetching ? (
          <h2> Loading...</h2>
        ) : !commits || commits.length <= 0 ? (
          <h2>Empty.</h2>
        ) : (
          <div style={style('flexColumns', { height: '100%' })}>
            <Header />
            <Stats />
            <div style={style('flexRows', { flexGrow: 1 })}>
              <Authors />
            </div>
          </div>
        )}
      </div>
    );
  }
}
// debugger;
export function mapStateToProps(state) {
  return getFilteredCommits(state);
}

export default connect(mapStateToProps)(GitTemporal);
