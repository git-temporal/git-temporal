import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debug } from 'app/utilities/logger';

import { selectPath, setOpenSidePanelGroup } from 'app/actions';
import { CollapsibleSidePanelGroups } from 'app/actions/ActionTypes';
import {
  getFilesContainerSort,
  getOpenSidePanelGroup,
} from 'app/selectors/stateVars';
import { getFilteredFilesForFilesContainer } from 'app/selectors/files';

import FilesActionMenu from './FilesActionMenu';
import { FileCard } from 'app/components/FileCard';
import { CollapsibleGroup } from 'app/components/CollapsibleGroup';
import { ExtendingList } from 'app/components/ExtendingList';

const COLLAPSIBLE_GROUP = CollapsibleSidePanelGroups.FILES;

export const Files: React.FC = (): React.ReactElement => {
  const filesContainerSort = useSelector(getFilesContainerSort);
  const files = useSelector(getFilteredFilesForFilesContainer);
  const openGroup = useSelector(getOpenSidePanelGroup);
  const dispatch = useDispatch();

  const title = `${files.length} Files`;
  const isOpen = openGroup === COLLAPSIBLE_GROUP;

  return (
    <CollapsibleGroup
      title={title}
      isOpen={isOpen}
      onOpenToggle={handleOpenGroupToggle}
    >
      <FilesActionMenu />
      <ExtendingList rowCount={files.length} rowRenderer={renderRow} />
    </CollapsibleGroup>
  );

  function handleOpenGroupToggle() {
    if (!isOpen) {
      dispatch(setOpenSidePanelGroup(COLLAPSIBLE_GROUP));
    }
  }

  function renderRow(index: number, key: string) {
    const file = files[index];
    return <FileCard key={key} file={file} onFileClick={onFileClick} />;
  }

  function onFileClick(event, fileName) {
    event.stopPropagation();
    dispatch(selectPath(fileName));
  }
};
