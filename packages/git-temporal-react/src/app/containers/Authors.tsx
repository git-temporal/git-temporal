import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debug } from 'app/utilities/logger';

import { style } from 'app/styles';
import { highlightCommits, setOpenSidePanelGroup } from 'app/actions';
import { CollapsibleSidePanelGroups } from 'app/actions/ActionTypes';
import { getAuthorsStats } from 'app/selectors/authors';
import {
  getHighlightedCommitIds,
  getOpenSidePanelGroup,
} from 'app/selectors/stateVars';

import { CollapsibleGroup } from 'app/components/CollapsibleGroup';
import { AuthorCard } from 'app/components/AuthorCard';
import { ExtendingList } from 'app/components/ExtendingList';

import AuthorsActionMenu from 'app/containers/AuthorsActionMenu';

const COLLAPSIBLE_GROUP = CollapsibleSidePanelGroups.AUTHORS;

export const Authors: React.FC = (): React.ReactElement => {
  const highlightedCommitIds = useSelector(getHighlightedCommitIds);
  const authorStats = useSelector(getAuthorsStats);
  const openGroup = useSelector(getOpenSidePanelGroup);
  const dispatch = useDispatch();

  const groupTitle = `${authorStats.authors.length} Authors`;
  const isOpen = openGroup === COLLAPSIBLE_GROUP;

  return (
    <CollapsibleGroup
      title={groupTitle}
      onOpenToggle={handleOpenGroupToggle}
      isOpen={isOpen}
    >
      <AuthorsActionMenu />
      <ExtendingList
        rowCount={authorStats.authors.length}
        rowRenderer={renderRow}
      />
    </CollapsibleGroup>
  );

  function handleOpenGroupToggle() {
    if (!isOpen) {
      dispatch(setOpenSidePanelGroup(COLLAPSIBLE_GROUP));
    }
  }

  function renderRow(index: number, key: string) {
    // debug('render row', row);
    const author = authorStats.authors[index];
    const isHighlighted =
      highlightedCommitIds &&
      highlightedCommitIds.length > 0 &&
      author.commits
        .map(c => {
          return c.id;
        })
        .includes(highlightedCommitIds[0]);

    return (
      <AuthorCard
        key={key}
        index={index}
        style={style}
        author={author}
        totalLinesAdded={authorStats.totalLinesAdded}
        totalLinesDeleted={authorStats.totalLinesDeleted}
        totalCommits={authorStats.totalCommits}
        maxImpact={authorStats.maxImpact}
        maxCommits={authorStats.maxCommits}
        isHighlighted={isHighlighted}
        onClick={onAuthorClick}
      />
    );
  }

  function onAuthorClick(_evt, author) {
    const commitIds = author.commits.map(commit => {
      return commit.id;
    });
    dispatch(highlightCommits(commitIds));
  }
};
