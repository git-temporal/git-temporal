import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as path from 'path';
import { debug } from 'app/utilities/logger';
import { style } from 'app/styles';
import { selectPath } from 'app/actions';
import {
  getSelectedPath,
  getDiff,
  getIsDiffFetching,
  getRerenderRequestedAt,
} from 'app/selectors/stateVars';
import { getDirectoryDiff } from 'app/selectors/files';

import { DifferenceViewerHeader } from 'app/containers/DifferenceViewerHeader';
import { SpinnerContainer } from 'app/components/SpinnerContainer';
import { DirectoryDifferences } from 'app/components/DirectoryDifferences';
import { FileDifferences } from 'app/components/FileDifferences';

const outerStyle = {
  _extends: ['altPanel', 'flexColumn', 'flexGrow'],
  position: 'relative',
  overflow: 'hidden',
};

const innerStyle = {
  _extends: ['flexColumn', 'flexGrow'],
  overflow: 'hidden',
  background: '@colors.background',
  color: '@colors.text',
};

export const DifferenceViewer: React.FC = (): React.ReactElement => {
  const selectedPath = useSelector(getSelectedPath);
  const diff = useSelector(getDiff);
  const isDiffFetching = useSelector(getIsDiffFetching);
  const rerenderRequestedAt = useSelector(getRerenderRequestedAt);
  const dirDiff = useSelector(getDirectoryDiff);

  const dispatch = useDispatch();

  return (
    <div style={style(outerStyle)}>
      <SpinnerContainer
        isSpinning={isDiffFetching || !diff}
        style={style(innerStyle)}
        opaque
      >
        <DifferenceViewerHeader />
        {diff && diff.isDirectory ? (
          <DirectoryDifferences
            modifiedFiles={diff.modifiedFiles}
            leftTree={dirDiff.leftTree}
            rightTree={dirDiff.rightTree}
            onFileClick={onFileClick}
          />
        ) : (
          diff && (
            <FileDifferences
              leftFileContents={diff.leftFileContents}
              rightFileContents={diff.rightFileContents}
              rerenderRequestedAt={rerenderRequestedAt}
            />
          )
        )}
      </SpinnerContainer>
    </div>
  );

  function onFileClick(fullPath) {
    dispatch(selectPath(fullPath));
  }
};
