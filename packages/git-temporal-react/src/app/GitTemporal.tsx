import React, { Component } from 'react';
import { connect } from 'react-redux';

import { GitTemporalProps, DispatchProps, StateProps } from 'app/interfaces';
import { selectPath } from 'app/actions';
import { getFilteredCommits } from 'app/selectors';

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
    const {
      selectedPath,
      serviceBaseUrl,
      isFetching,
      commits,
      authorNames = [],
    } = this.props;

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
            <div>
              <label>{authorNames.length} Authors</label>
              {authorNames.map(authorName => (
                <div key={authorName}>{authorName}</div>
              ))}
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
