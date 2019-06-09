import React, { Component } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { selectPath } from 'app/actions';
import { getFilesContainerSort } from 'app/selectors/stateVars';
import { getFilteredFilesForFilesContainer } from 'app/selectors/files';

import FilesActionMenu from './FilesActionMenu';
import { FileCard } from 'app/components/FileCard';
import { CollapsibleGroup } from 'app/components/CollapsibleGroup';
import { ExtendingList } from 'app/components/ExtendingList';

export const Files: React.FC = (): React.ReactElement => {
  const filesContainerSort = useSelector(getFilesContainerSort);
  const files = useSelector(getFilteredFilesForFilesContainer);
  const dispatch = useDispatch();

  const title = `${files.length} Files`;
  return (
    <CollapsibleGroup title={title}>
      <FilesActionMenu />
      <ExtendingList rowCount={files.length} rowRenderer={renderRow} />
    </CollapsibleGroup>
  );

  function renderRow(index: number, key: string) {
    const file = files[index];
    return <FileCard key={key} file={file} onFileClick={onFileClick} />;
  }

  function onFileClick(event, fileName) {
    event.stopPropagation();
    dispatch(selectPath(fileName));
  }
};
