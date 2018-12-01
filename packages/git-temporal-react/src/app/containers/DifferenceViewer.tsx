import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as path from 'path';

import {
  DispatchProps,
  IDifferenceViewerContainerState,
  ICommit,
  IModifiedFile,
} from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';
import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { Error } from 'app/components/Error';
import { DirectoryDifferences } from 'app/components/DirectoryDifferences';
import { FileDifferences } from 'app/components/FileDifferences';

import DifferenceViewerHeader from 'app/containers/DifferenceViewerHeader';

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

const innerStyle = {
  _extends: 'flexColumns',
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
    return (
      <div style={style(outerStyle)}>
        {this.state.errorOnLastFetch ? (
          <Error
            message="Unable to retrieve diff from service."
            htmlDetailMessage={this.state.errorOnLastFetch}
          />
        ) : (
          <SpinnerContainer
            isSpinning={this.state.isFetching}
            style={style(innerStyle)}
          >
            <DifferenceViewerHeader />
            {this.state.isDirectory ? (
              <DirectoryDifferences
                modifiedFiles={this.state.modifiedFiles}
                onFileClick={this.onFileClick}
              />
            ) : (
              <FileDifferences
                leftFileContents={this.state.leftFileContents}
                rightFileContents={this.state.rightFileContents}
              />
            )}
          </SpinnerContainer>
        )}
      </div>
    );
  }

  fetchDiff() {
    const lastFilteredCommit = this.getLastFilteredCommit();
    const leftCommit =
      this.props.startDate && lastFilteredCommit
        ? `&leftCommit=${lastFilteredCommit.id}`
        : '';
    const firstFilteredCommit = this.getFirstFilteredCommit();
    const rightCommit =
      this.props.endDate && firstFilteredCommit
        ? `&rightCommit=${firstFilteredCommit.id}`
        : '';
    const path = this.props.selectedPath || './';
    this.getPathForCommit(firstFilteredCommit);
    this.getPathForCommit(lastFilteredCommit);

    const pathParam = path && path.trim().length > 0 ? `?path=${path}` : '';

    this.setState({ isFetching: true, errorOnLastFetch: null });

    // TODO : replace this with serviceBaseUrl when it is in
    return fetch(
      `http://localhost:11966/git-temporal/diff${pathParam}${leftCommit}${rightCommit}`
    )
      .then(this.onDiffResponse)
      .then(this.onDiffReceived);
  }

  getLastFilteredCommitId(commits?: ICommit[]) {
    const lastCommit = this.getLastFilteredCommit(commits);
    return (lastCommit && lastCommit.id) || null;
  }

  getLastFilteredCommit(commits?: ICommit[]) {
    const whichCommits = commits || this.props.filteredCommits;
    if (!whichCommits || whichCommits.length < 1) {
      return null;
    }
    return whichCommits[whichCommits.length - 1];
  }

  getFirstFilteredCommitId(commits?: ICommit[]) {
    const firstCommit = this.getFirstFilteredCommit(commits);
    return (firstCommit && firstCommit.id) || null;
  }

  getFirstFilteredCommit(commits?: ICommit[]) {
    const whichCommits = commits || this.props.filteredCommits;
    if (!whichCommits || whichCommits.length <= 0) {
      return null;
    }
    return whichCommits[0];
  }

  getPathForCommit(commit) {
    console.log(commit);
    const path = this.props.selectedPath || './';
    // const {files} = commit
    // if (files.length === 1 && files[0].name === path) {
    //   path = commit.files[0].name;
    //   path = path.replace(/\{(.*)\s=>\s(.*)\}/g, '$2');
    // }
    return path;
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

  onFileClick = relativePath => {
    const fullPath = path.join(this.props.selectedPath, relativePath);
    this.props.dispatch(selectPath(fullPath));
  };
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
