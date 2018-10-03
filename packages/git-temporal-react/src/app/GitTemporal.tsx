import React, { Component } from 'react';
import { GitTemporalProps, DispatchProps, StateProps } from './interfaces';
import { connect } from 'react-redux';
import { selectPath } from './actions';

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
  // handleRefreshClick = e => {
  //   e.preventDefault();

  //   const { dispatch, path } = this.props;
  //   dispatch(invalidatePath(path));
  //   dispatch(fetchCommitsIfNeeded(path));
  // };

  render() {
    const { selectedPath, serviceBaseUrl, isFetching, commits } = this.props;

    return (
      <div>
        {isFetching ? (
          <h2> Loading...</h2>
        ) : !commits || commits.length <= 0 ? (
          <h2>Empty.</h2>
        ) : (
          <div>
            <h1>I'm going to grow up to be a real app one day.</h1>
            <p>
              Unless Bee gets sick of TS causing her extra work and throws the
              baby out with the bath water.
            </p>
            <div>
              <label>Path:</label>
              {selectedPath}
            </div>
            <div>
              <label>baseServiceUrl:</label>
              {serviceBaseUrl}
            </div>
            <div>
              <label>number of commits:</label>
              {commits && commits.length}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export function mapStateToProps(state) {
  const { selectedPath, commitsByPath } = state;
  const { isFetching, commits } = commitsByPath[selectedPath] || {
    isFetching: true,
    commits: [],
  };

  return {
    selectedPath,
    commits,
    isFetching,
  };
}

export default connect(mapStateToProps)(GitTemporal);
