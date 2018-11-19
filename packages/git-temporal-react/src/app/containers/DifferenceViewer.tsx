import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  DispatchProps,
  IDifferenceViewerContainerState,
  ICommit,
} from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';

interface IDifferenceViewerLocalState {
  leftFileContents?: string;
  rightFileContents?: string;
  rawDiff?: string;
  isDirectory: boolean;
  isFetching: boolean;
}

const outerStyle = {
  _extends: ['borderedPanel', 'flexColumns'],
  flexGrow: 1,
  position: 'relative',
  minWidth: '90%',
  maxWidth: 320,
};

export class DifferenceViewer extends Component<
  IDifferenceViewerContainerState & DispatchProps,
  IDifferenceViewerLocalState
> {
  readonly state = { isFetching: false, isDirectory: false };

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.state.isFetching &&
      (this.getFirstCommitId(prevProps.commits) !== this.getFirstCommitId() ||
        this.getLastCommitId(prevProps.commits) !== this.getLastCommitId())
    ) {
      this.fetchDiff();
    }
  }

  render() {
    return (
      <div style={style(outerStyle)}>
        <img
          style={{ width: '100%', height: '100%' }}
          src="Freehand_-_diff_viewer.png"
        />
      </div>
    );
  }

  fetchDiff() {
    const path = this.props.selectedPath || './';
    const leftCommit = this.props.startDate
      ? `&leftCommit=${this.getLastCommitId()}`
      : '';
    const rightCommit = this.props.endDate
      ? `&rightCommit=${this.getFirstCommitId()}`
      : '';

    const pathParam = path && path.trim().length > 0 ? `?path=${path}` : '';

    this.setState({ isFetching: true });

    // TODO : replace this with serviceBaseUrl when it is in
    return fetch(
      `http://localhost:11966/git-temporal/diff${pathParam}${leftCommit}${rightCommit}`
    )
      .then(response => response.json())
      .then(this.diffReceived);
  }

  getLastCommitId(commits?: ICommit[]) {
    const whichCommits = commits || this.props.commits;
    if (!whichCommits || whichCommits.length < 1) {
      return null;
    }
    return whichCommits[whichCommits.length - 1].id;
  }

  getFirstCommitId(commits?: ICommit[]) {
    const whichCommits = commits || this.props.commits;
    if (!whichCommits || whichCommits.length <= 0) {
      return null;
    }
    return whichCommits[0].id;
  }

  diffReceived = diff => {
    this.setState({
      isFetching: false,
      isDirectory: diff.isDirectory,
      // contents and diff are base64 encoded
      leftFileContents: diff.leftFileContents && atob(diff.leftFileContents),
      rightFileContents: diff.rightFileContents && atob(diff.rightFileContents),
      rawDiff: atob(diff.rawDiff),
    });
  };
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
