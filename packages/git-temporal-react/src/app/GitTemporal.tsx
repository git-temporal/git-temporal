import React, { Component } from 'react';
import { GitTemporalProps, DispatchProps, StateProps } from './interfaces';
import { connect } from 'react-redux';
import { selectPath, fetchCommitsIfNeeded, invalidatePath } from './actions';

class GitTemporal extends Component<
  GitTemporalProps & DispatchProps & StateProps
> {
  componentDidMount() {
    const { path, dispatch } = this.props;
    dispatch(fetchCommitsIfNeeded(path));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      const { dispatch, path } = nextProps;
      dispatch(fetchCommitsIfNeeded(path));
    }
  }

  handleChange = nextPath => {
    this.props.dispatch(selectPath(nextPath));
  };

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch, path } = this.props;
    dispatch(invalidatePath(path));
    dispatch(fetchCommitsIfNeeded(path));
  };

  render() {
    const { path, serviceBaseUrl, isFetching, commits } = this.props;

    return (
      <div>
        {!commits || commits.length <= 0 ? (
          isFetching ? (
            <h2> Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div>
            <h1>I'm going to grow up to be a real app one day.</h1>
            <p>
              Unless Bee gets sick of TS causing her extra work and throws the
              baby out with the bath water.
            </p>
            <div>
              <label>Path:</label>
              {path}
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

const mapStateToProps = state => {
  const { path, commitsByPath } = state;
  const { isFetching, items: commits } = commitsByPath[path] || {
    isFetching: true,
    items: [],
  };

  return {
    path,
    commits,
    isFetching,
  };
};

export default connect(mapStateToProps)(GitTemporal);
