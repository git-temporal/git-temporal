import React, { useEffect, useState } from 'react';
import { style } from 'app/styles';
import { debug } from '@git-temporal/logger';

import { IModifiedFile } from 'app/interfaces';

import { DirectoryTree } from 'app/components/DirectoryTree';
import { usePrevious } from 'app/utilities/hooks';

export interface DirectoryDifferencesProps {
  modifiedFiles: IModifiedFile[];
  leftTree;
  rightTree;
  // only show commits that DON't have .status of this value
  style?: object | string;
  onFileClick: (fullPath: string) => void;
}

interface DirectoryDifferencesState {
  // these map to the index of each node
  expandedNodes: string[];
}

const outerStyle = {
  _extends: 'flexRow',
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

export const DirectoryDifferences: React.FC<DirectoryDifferencesProps> = (
  props
): React.ReactElement => {
  const [expandedNodes, setExpandedNodes] = useState([]);
  const prevModifiedFiles = usePrevious({ modifiedFiles: props.modifiedFiles });

  useEffect(() => {
    if (didModifiedFilesChange(prevModifiedFiles)) {
      debug('componentDidUpdate modifiedFiles changed');
      // setExpandedNodes([]);
    }
  });
  const { leftTree, rightTree } = props;
  return (
    <div style={style(outerStyle, props.style)}>
      <DirectoryTree
        fileTree={leftTree}
        expandedNodes={expandedNodes}
        onExpandNode={onExpandNode}
        onFileClick={onFileClick}
      />
      <DirectoryTree
        fileTree={rightTree}
        expandedNodes={expandedNodes}
        onExpandNode={onExpandNode}
        onFileClick={onFileClick}
      />
    </div>
  );

  function didModifiedFilesChange(prevModifiedFiles) {
    const { modifiedFiles } = props;
    // debug('didModifiedFilesChange', modifiedFiles, prevModifiedFiles);
    if (!modifiedFiles || !prevModifiedFiles) {
      // debug('one or both null');
      return modifiedFiles !== prevModifiedFiles;
    }
    if (modifiedFiles.length !== prevModifiedFiles.length) {
      // debug('lengthsDiffer');
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

  function onFileClick(fullPath) {
    props.onFileClick(fullPath);
  }

  function onExpandNode(fullPath) {
    const currentIndex = expandedNodes.indexOf(fullPath);
    let newExpandedNodes;
    if (currentIndex === -1) {
      newExpandedNodes = expandedNodes.slice(0);
      newExpandedNodes.push(fullPath);
    } else {
      newExpandedNodes = expandedNodes
        .slice(0, currentIndex)
        .concat(expandedNodes.slice(currentIndex + 1));
    }
    setExpandedNodes(newExpandedNodes);
  }
};
