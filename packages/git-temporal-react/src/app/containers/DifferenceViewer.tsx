import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  DispatchProps,
  IDifferenceViewerContainerState,
  ICommit,
} from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';

import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { Error } from 'app/components/Error';

interface IDifferenceViewerLocalState {
  isDirectory: boolean;
  isFetching: boolean;
  errorOnLastFetch?: string;
  leftFileContents?: string;
  rightFileContents?: string;
  filesAdded?: string[];
  filesDeleted?: string[];
  filesModified?: string[];
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
  readonly state: IDifferenceViewerLocalState = {
    isFetching: false,
    isDirectory: false,
  };

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
        {this.state.errorOnLastFetch ? (
          <Error
            message="Unable to retrieve diff from service."
            htmlDetailMessage={this.state.errorOnLastFetch}
          />
        ) : (
          <SpinnerContainer isSpinning={this.state.isFetching}>
            <img
              style={{ width: '100%', height: '100%' }}
              src="Freehand_-_diff_viewer.png"
            />
          </SpinnerContainer>
        )}
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
      .then(this.onDiffResponse)
      .then(this.onDiffReceived);
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

  onDiffResponse = response => {
    if (response.status >= 400) {
      console.error('error on diff api call', response);
      response.text().then(responseText => {
        this.setState({
          errorOnLastFetch: `${response.status} - ${
            response.statusText
          }\n\n${responseText}`,
        });
      });
      return null;
    }
    return response.json();
  };

  onDiffReceived = diff => {
    if (!diff) {
      return;
    }
    this.setState({
      isFetching: false,
      isDirectory: diff.isDirectory,
      // contents are base64 encoded
      leftFileContents: diff.leftFileContents && atob(diff.leftFileContents),
      rightFileContents: diff.rightFileContents && atob(diff.rightFileContents),
      filesAdded: diff.filesAdded,
      filesDeleted: diff.filesDeleted,
      filesModified: diff.filesModified,
    });
  };
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
