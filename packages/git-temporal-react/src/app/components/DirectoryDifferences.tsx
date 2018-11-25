import React from 'react';
import { style } from 'app/styles';

import { IModifiedFile } from 'app/interfaces';
import { convertModifiedFilesToTree } from 'app/selectors/files';

import { CaretDownIcon } from 'app/components/CaretDownIcon';
import { CaretRightIcon } from 'app/components/CaretRightIcon';
import { FileIcon } from 'app/components/FileIcon';

export interface DirectoryDifferencesProps {
  modifiedFiles: IModifiedFile[];
  style?: object | string;
}

interface DirectoryDifferencesState {
  // these map to the index of each node
  expandedNodes: number[];
}

const outerStyle = {
  display: 'inline-block',
  transition: 'all 1s ease',
};
const directoryNodeStyle = {
  display: 'block',
  marginLeft: 20,
};
const treeNodeStyle = {
  marginLeft: 10,
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
    const modifiedTree = convertModifiedFilesToTree(this.props);
    console.log(
      'DirectoryDifferences::render()',
      this.props.modifiedFiles,
      modifiedTree
    );
    return (
      <div style={style(outerStyle, this.props.style)}>
        {this.renderTree(modifiedTree)}
      </div>
    );
  }

  renderTree(treeNode) {
    let renderedTreeNodes = [];
    for (const nodeName in treeNode) {
      const childNode = treeNode[nodeName];
      const isExpanded =
        this.state.expandedNodes.includes(childNode.index) ||
        Object.keys(childNode.nodes).length <= 1;
      const isFile =
        !childNode.nodes || Object.keys(childNode.nodes).length === 0;
      const { Icon, onClick } = isFile
        ? {
            Icon: FileIcon,
            onClick: null,
          }
        : {
            Icon: isExpanded ? CaretDownIcon : CaretRightIcon,
            onClick: () => {
              this.onExpandNode(childNode.index);
            },
          };
      renderedTreeNodes.push(
        <div
          style={style(treeNodeStyle)}
          onClick={onClick}
          key={childNode.index}
        >
          <Icon height={14} width={14} />
          {'    '}
          {nodeName}
        </div>
      );
      if (isExpanded) {
        renderedTreeNodes = renderedTreeNodes.concat(
          this.renderTree(childNode.nodes)
        );
      }
    }
    return <div style={directoryNodeStyle}>{renderedTreeNodes}</div>;
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

  onExpandNode = nodeIndex => {
    const currentIndex = this.state.expandedNodes.indexOf(nodeIndex);
    let expandedNodes;
    if (currentIndex === -1) {
      expandedNodes = this.state.expandedNodes.slice(0);
      expandedNodes.push(nodeIndex);
      this.setState({ expandedNodes });
    } else {
      expandedNodes = this.state.expandedNodes
        .slice(0, currentIndex)
        .concat(this.state.expandedNodes.slice(currentIndex + 1));
    }
    this.setState({ expandedNodes });
  };
}
