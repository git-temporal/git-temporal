import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as path from 'path';

import {
  DispatchProps,
  IDifferenceViewerContainerState,
  ICommit,
} from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';
import { fetchDiff } from 'app/actions/diff';
import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { DirectoryDifferences } from 'app/components/DirectoryDifferences';
import { FileDifferences } from 'app/components/FileDifferences';

import DifferenceViewerHeader from 'app/containers/DifferenceViewerHeader';

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
  IDifferenceViewerContainerState & DispatchProps
> {
  componentDidUpdate(prevProps) {
    if (
      this.getFirstFilteredCommitId(prevProps.filteredCommits) !==
        this.getFirstFilteredCommitId() ||
      this.getLastFilteredCommitId(prevProps.filteredCommits) !==
        this.getLastFilteredCommitId()
    ) {
      this.updateDiff();
    }
  }

  render() {
    return (
      <div style={style(outerStyle)}>
        <SpinnerContainer
          isSpinning={this.props.isDiffFetching || !this.props.diff}
          style={style(innerStyle)}
        >
          <DifferenceViewerHeader />
          {this.props.diff.isDirectory ? (
            <DirectoryDifferences
              modifiedFiles={this.props.diff.modifiedFiles}
              onFileClick={this.onFileClick}
            />
          ) : (
            <FileDifferences
              leftFileContents={this.props.diff.leftFileContents}
              rightFileContents={this.props.diff.rightFileContents}
            />
          )}
        </SpinnerContainer>
      </div>
    );
  }

  updateDiff() {
    const lastFilteredCommit = this.getLastFilteredCommit();
    const leftCommit =
      this.props.startDate && lastFilteredCommit && lastFilteredCommit.id;
    const firstFilteredCommit = this.getFirstFilteredCommit();
    const rightCommit =
      this.props.endDate && firstFilteredCommit && firstFilteredCommit.id;

    const path = this.props.selectedPath || './';

    this.props.dispatch(fetchDiff(path, leftCommit, rightCommit));
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

  onFileClick = relativePath => {
    const fullPath = path.join(this.props.selectedPath, relativePath);
    this.props.dispatch(selectPath(fullPath));
  };
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
