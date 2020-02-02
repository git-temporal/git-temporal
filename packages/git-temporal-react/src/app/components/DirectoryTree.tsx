import React from 'react';
import { style } from 'app/styles';

import { CaretDownIcon } from 'app/components/CaretDownIcon';
import { CaretRightIcon } from 'app/components/CaretRightIcon';
import { FileIcon } from 'app/components/FileIcon';
import { CommaNumber } from 'app/components/CommaNumber';

export interface DirectoryTreeProps {
  fileTree: object;
  expandedNodes: string[];
  onExpandNode: (fullPath: string) => void;
  onFileClick: (fullPath: string) => void;
  // only show commits that DON't have .status of this value
  filterCommitStatus?: 'added' | 'deleted' | 'modified';
  style?: object | string;
}

const outerStyle = {
  transition: 'all 1s ease',
  flexGrow: 1,
};
const directoryNodeStyle = {
  display: 'block',
  marginLeft: 20,
};
const treeNodeStyle = {
  _extends: 'normalText',
  marginLeft: 10,
};
const fileNameStyle = {
  _extends: 'normalText',
  textDecoration: 'underline',
  cursor: 'pointer',
};
const deltaStyle = {
  _extends: 'smallerText',
  float: 'right',
};
// const iconSize = 12;

// const iconStyle = {
//   display: 'inline-block',
//   height: iconSize,
//   width: iconSize,
//   textAlign: 'center'
// }

export class DirectoryTree extends React.Component<DirectoryTreeProps> {
  render() {
    return (
      <div
        style={style(outerStyle, this.props.style)}
        data-testid="directoryTree"
      >
        {this.renderTree(this.props.fileTree)}
      </div>
    );
  }

  renderTree(treeNode, key = 0) {
    let renderedTreeNodes = [];
    let index = 0;
    for (const nodeName in treeNode) {
      index += 1;
      const childNode = treeNode[nodeName];
      const isExpanded =
        this.props.expandedNodes.includes(childNode.fullPath) ||
        Object.keys(childNode.nodes).length <= 1 ||
        Object.keys(treeNode).length <= 1;

      renderedTreeNodes.push(
        this.isFile(childNode)
          ? this.renderFileTreeNode(childNode, nodeName, key + index)
          : this.renderDirectoryTreeNode(
              childNode,
              nodeName,
              isExpanded,
              key + index
            )
      );
      if (isExpanded) {
        renderedTreeNodes = renderedTreeNodes.concat(
          this.renderTree(childNode.nodes, key + index)
        );
      }
    }
    return (
      <div style={directoryNodeStyle} key={key + index + 1}>
        {renderedTreeNodes}
      </div>
    );
  }

  renderFileTreeNode(childNode, nodeName, key) {
    return this.renderTreeNode(childNode, nodeName, FileIcon, key, () => {
      this.props.onFileClick(childNode.fullPath);
    });
  }

  renderDirectoryTreeNode(childNode, nodeName, isExpanded, key) {
    return this.renderTreeNode(
      childNode,
      nodeName,
      isExpanded ? CaretDownIcon : CaretRightIcon,
      key,
      () => {
        this.props.onExpandNode(childNode.fullPath);
      }
    );
  }

  renderTreeNode(childNode, nodeName, Icon, key, onClick) {
    const nodeStyle = Object.assign({}, treeNodeStyle) as any;
    nodeStyle.color = `@colors.${childNode.status}`;
    const nameStyle = this.isFile(childNode) ? fileNameStyle : {};
    return (
      <div
        key={key}
        style={style(nodeStyle)}
        onClick={onClick}
        data-testid="directoryTreeNode"
      >
        <Icon height={14} width={14} />
        {'    '}
        <span
          style={style(nameStyle, { color: nodeStyle.color })}
          title="click to filter"
        >
          {nodeName}
        </span>
        {'    '}
        <div style={style(deltaStyle)}>
          <CommaNumber value={childNode.delta || 0} />
          𝚫
        </div>
      </div>
    );
  }
  isFile(childNode) {
    return !childNode.nodes || Object.keys(childNode.nodes).length === 0;
  }
}
