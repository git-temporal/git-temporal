import React, { Component } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';
import { debug } from '@git-temporal/logger';

import { selectPath } from 'app/actions';
import { getFilesContainerSort } from 'app/selectors/stateVars';
import { getFilteredFilesForFilesContainer } from 'app/selectors/files';

import FilesActionMenu from './FilesActionMenu';
import { FileCard } from 'app/components/FileCard';
import { CollapsibleGroup } from 'app/components/CollapsibleGroup';

export const Files: React.FC = (): React.ReactElement => {
  const filesContainerSort = useSelector(getFilesContainerSort);
  const files = useSelector(getFilteredFilesForFilesContainer);
  const dispatch = useDispatch();

  const title = `${files.length} Files`;
  return (
    <CollapsibleGroup title={title}>
      <FilesActionMenu />
      <div style={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={
                width || 100 // width and height below need minimums for testing
              }
              height={height || 100}
              rowHeight={60}
              rowRenderer={renderRow}
              rowCount={files.length}
              filesContainerSort={filesContainerSort}
            />
          )}
        </AutoSizer>
      </div>
    </CollapsibleGroup>
  );

  function renderRow({ index, style, key }) {
    const file = files[index];
    style.width = 'calc(100% - 20px)';
    return (
      <FileCard key={key} style={style} file={file} onFileClick={onFileClick} />
    );
  }

  function onFileClick(event, fileName) {
    event.stopPropagation();
    dispatch(selectPath(fileName));
  }
};
