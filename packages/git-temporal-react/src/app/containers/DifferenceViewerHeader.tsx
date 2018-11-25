import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  DispatchProps,
  IDifferenceViewerContainerState,
  ICommit,
  IModifiedFile,
} from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';

import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { Error } from 'app/components/Error';
import { DirectoryDifferences } from 'app/components/DirectoryDifferences';
import { RevSelector } from 'app/components/RevSelector';
import { EpochDateTime } from 'app/components/EpochDateTime';

interface IDifferenceViewerLocalState {
  isDirectory: boolean;
  isFetching: boolean;
  errorOnLastFetch?: string;
  leftFileContents?: string;
  rightFileContents?: string;
  modifiedFiles?: IModifiedFile[];
}

const outerStyle = {
  _extends: ['borderedPanel', 'flexColumns'],
  flexGrow: 1,
  position: 'relative',
  minWidth: '90%',
};

const revSelectorsStyle = {
  _extends: 'flexRows',
  flexGrow: 0,
};

const revSelectorStyle = {
  flexGrow: 1,
  textAlign: 'center',
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
      this.getFirstFilteredCommitId(prevProps.filteredCommits) !==
        this.getFirstFilteredCommitId() ||
      this.getLastFilteredCommitId(prevProps.filteredCommits) !==
        this.getLastFilteredCommitId()
    ) {
      this.fetchDiff();
    }
  }

  render() {
    const { commits, startDate, endDate } = this.props;
    const disablePrevious = startDate && commits[0].authorDate <= startDate;
    const disableNext = !endDate;

    return (
      <div style={style(outerStyle)}>
        {this.state.errorOnLastFetch ? (
          <Error
            message="Unable to retrieve diff from service."
            htmlDetailMessage={this.state.errorOnLastFetch}
          />
        ) : (
          <SpinnerContainer isSpinning={this.state.isFetching}>
            <div style={style(revSelectorsStyle)}>
              <RevSelector
                style={style(revSelectorStyle)}
                disablePrevious={disablePrevious}
                disableNext={disableNext}
              >
                {this.renderLeftRev()}
              </RevSelector>
              <RevSelector
                style={style(revSelectorStyle)}
                disablePrevious={disablePrevious}
                disableNext={disableNext}
              >
                {this.renderRightRev()}
              </RevSelector>
            </div>
            {this.state.isDirectory ? (
              <DirectoryDifferences modifiedFiles={this.state.modifiedFiles} />
            ) : (
              <img
                style={{ width: '100%', height: '100%' }}
                src="Freehand_-_diff_viewer.png"
              />
            )}
          </SpinnerContainer>
        )}
      </div>
    );
  }

  renderRightRev() {
    const { endDate, filteredCommits } = this.props;
    const lastCommit = filteredCommits[filteredCommits.length - 1];
    return endDate ? (
      <span>
        <span>#{lastCommit.hash} - </span>
        <EpochDateTime value={lastCommit.authorDate} />
      </span>
    ) : (
      <span>Uncommitted Local Changes</span>
    );
  }

  renderLeftRev() {
    const { startDate, filteredCommits, commits } = this.props;
    const firstCommit = filteredCommits[0] || commits[commits.length - 1];
    if (!firstCommit) {
      return null;
    }
    return (
      <span>
        <span>#{firstCommit.hash} - </span>
        <EpochDateTime value={firstCommit.authorDate} />
        {!startDate && ' (Local HEAD Revision)'}
      </span>
    );
  }

  fetchDiff() {
    const path = this.props.selectedPath || './';
    const leftCommit = this.props.startDate
      ? `&leftCommit=${this.getLastFilteredCommitId()}`
      : '';
    const rightCommit = this.props.endDate
      ? `&rightCommit=${this.getFirstFilteredCommitId()}`
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

  getLastFilteredCommitId(commits?: ICommit[]) {
    const whichCommits = commits || this.props.filteredCommits;
    if (!whichCommits || whichCommits.length < 1) {
      return null;
    }
    return whichCommits[whichCommits.length - 1].id;
  }

  getFirstFilteredCommitId(commits?: ICommit[]) {
    const whichCommits = commits || this.props.filteredCommits;
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
          isFetching: false,
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
      modifiedFiles: diff.modifiedFiles,
    });
  };
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
