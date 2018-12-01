import React from 'react';
import { style } from 'app/styles';

import { IModifiedFile } from 'app/interfaces';
import { convertModifiedFilesToTrees } from 'app/selectors/files';

import { DirectoryTree } from 'app/components/DirectoryTree';

export interface DirectoryDifferencesProps {
  modifiedFiles: IModifiedFile[];
  // only show commits that DON't have .status of this value
  style?: object | string;
  onFileClick: (fullPath: string) => void;
}

interface DirectoryDifferencesState {
  // these map to the index of each node
  expandedNodes: string[];
}

const outerStyle = {
  _extends: 'flexRows',
  transition: 'all 1s ease',
  overflow: 'scroll',
};
// const iconSize = 12;

// const iconStyle = {
//   display: 'inline-block',
//   height: iconSize,
//   width: iconSize,
//   textAlign: 'center'
// }

export class DirectoryDifferences extends React.Component<
  DirectoryDifferencesProps,
  DirectoryDifferencesState
> {
  readonly state: DirectoryDifferencesState = { expandedNodes: [] };

  componentDidUpdate(prevProps) {
    if (this.didModifiedFilesChange(prevProps.modifiedFiles)) {
      console.log(
        'componentDidUpdate modifiedFiles changed',
        prevProps,
        this.props
      );
      this.setState({ expandedNodes: [] });
    }
  }
  render() {
    const { leftTree, rightTree } = convertModifiedFilesToTrees(
      this.props
    ) as any;
    console.log('DirectoryDifferences::render()', leftTree, rightTree);
    return (
      <div style={style(outerStyle, this.props.style)}>
        <DirectoryTree
          fileTree={leftTree}
          expandedNodes={this.state.expandedNodes}
          onExpandNode={this.onExpandNode}
          onFileClick={this.onFileClick}
        />
        <DirectoryTree
          fileTree={rightTree}
          expandedNodes={this.state.expandedNodes}
          onExpandNode={this.onExpandNode}
          onFileClick={this.onFileClick}
        />
      </div>
    );
  }

  didModifiedFilesChange(prevModifiedFiles) {
    const { modifiedFiles } = this.props;
    // console.log('didModifiedFilesChange', modifiedFiles, prevModifiedFiles);
    if (!modifiedFiles || !prevModifiedFiles) {
      // console.log('one or both null');
      return modifiedFiles !== prevModifiedFiles;
    }
    if (modifiedFiles.length !== prevModifiedFiles.length) {
      // console.log('lengthsDiffer');
      return true;
    }
    return !modifiedFiles.every((file, index) => {
      const prevFile = prevModifiedFiles[index];
      const result =
        file.path === prevFile.path &&
        file.delta === prevFile.delta &&
        file.status === prevFile.status;

      return result;
    });
  }

  onFileClick = fullPath => {
    this.props.onFileClick(fullPath);
  };

  onExpandNode = fullPath => {
    const currentIndex = this.state.expandedNodes.indexOf(fullPath);
    let expandedNodes;
    if (currentIndex === -1) {
      expandedNodes = this.state.expandedNodes.slice(0);
      expandedNodes.push(fullPath);
      this.setState({ expandedNodes });
    } else {
      expandedNodes = this.state.expandedNodes
        .slice(0, currentIndex)
        .concat(this.state.expandedNodes.slice(currentIndex + 1));
    }
    this.setState({ expandedNodes });
  };
}
