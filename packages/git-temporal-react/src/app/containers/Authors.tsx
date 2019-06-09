import React, { Component } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';
import { debug } from '@git-temporal/logger';

import { style } from 'app/styles';
import { highlightCommits } from 'app/actions';
import { getAuthorsStats } from 'app/selectors/authors';
import {
  getAuthorsContainerSort,
  getHighlightedCommitIds,
} from 'app/selectors/stateVars';
import { CollapsibleGroup } from 'app/components/CollapsibleGroup';
import { AuthorCard } from 'app/components/AuthorCard';

import AuthorsActionMenu from 'app/containers/AuthorsActionMenu';

const headerStyle = {
  _extends: ['h2Text'],
  display: 'block',
  flexGrow: 0,
};
const listStyle = { display: 'flex', flexGrow: 1 };

export const Authors: React.FC = (): React.ReactElement => {
  const authorsContainerSort = useSelector(getAuthorsContainerSort);
  const highlightedCommitIds = useSelector(getHighlightedCommitIds);
  const authorStats = useSelector(getAuthorsStats);
  const dispatch = useDispatch();

  const groupTitle = `${authorStats.authors.length} Authors`;

  return (
    <CollapsibleGroup title={groupTitle}>
      <AuthorsActionMenu />
      <div style={style(listStyle)}>
        <AutoSizer>
          {({ height, width }) => {
            return renderList(height, width);
          }}
        </AutoSizer>
      </div>
    </CollapsibleGroup>
  );

  function renderList(height, width) {
    // authorsContainerSort and highlightedCommitIds are passed
    // to the list to force it to update when they change. as you do
    return (
      <List
        width={
          width || 100 // width and height below need minimums for testing
        }
        height={height || 100}
        rowHeight={120}
        rowRenderer={renderRow}
        rowCount={authorStats.authors.length}
        authorsContainerSort={authorsContainerSort}
        highlightedCommitIds={highlightedCommitIds}
      />
    );
  }

  function renderRow({ index, style, key }) {
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
    style.width = 'calc(100% - 20px)';
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
