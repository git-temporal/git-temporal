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
      <div style={style(outerStyle, this.props.style)}>
        {this.renderTree(this.props.fileTree)}
      </div>
    );
  }

  renderTree(treeNode) {
    let renderedTreeNodes = [];
    for (const nodeName in treeNode) {
      const childNode = treeNode[nodeName];
      const isExpanded =
        this.props.expandedNodes.includes(childNode.fullPath) ||
        Object.keys(childNode.nodes).length <= 1 ||
        Object.keys(treeNode).length <= 1;

      renderedTreeNodes.push(
        this.isFile(childNode)
          ? this.renderFileTreeNode(childNode, nodeName)
          : this.renderDirectoryTreeNode(childNode, nodeName, isExpanded)
      );
      if (isExpanded) {
        renderedTreeNodes = renderedTreeNodes.concat(
          this.renderTree(childNode.nodes)
        );
      }
    }
    return <div style={directoryNodeStyle}>{renderedTreeNodes}</div>;
  }

  renderFileTreeNode(childNode, nodeName) {
    return this.renderTreeNode(childNode, nodeName, FileIcon, () => {
      this.props.onFileClick(childNode.fullPath);
    });
  }

  renderDirectoryTreeNode(childNode, nodeName, isExpanded) {
    return this.renderTreeNode(
      childNode,
      nodeName,
      isExpanded ? CaretDownIcon : CaretRightIcon,
      () => {
        this.props.onExpandNode(childNode.fullPath);
      }
    );
  }

  renderTreeNode(childNode, nodeName, Icon, onClick) {
    const nodeStyle = Object.assign({}, treeNodeStyle) as any;
    nodeStyle.color = `@colors.${childNode.status}`;
    const nameStyle = this.isFile(childNode) ? fileNameStyle : {};
    return (
      <div style={style(nodeStyle)} onClick={onClick} key={childNode.index}>
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
