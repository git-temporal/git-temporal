import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { style } from 'app/styles';
import { highlightCommits } from 'app/actions';
import { getAuthorsStats } from 'app/selectors/authors';
import { getHighlightedCommitIds } from 'app/selectors/stateVars';

import { CollapsibleGroup } from 'app/components/CollapsibleGroup';
import { AuthorCard } from 'app/components/AuthorCard';
import { ExtendingList } from 'app/components/ExtendingList';

import AuthorsActionMenu from 'app/containers/AuthorsActionMenu';

export const Authors: React.FC = (): React.ReactElement => {
  const highlightedCommitIds = useSelector(getHighlightedCommitIds);
  const authorStats = useSelector(getAuthorsStats);
  const dispatch = useDispatch();

  const groupTitle = `${authorStats.authors.length} Authors`;

  return (
    <CollapsibleGroup title={groupTitle}>
      <AuthorsActionMenu />
      <ExtendingList
        rowCount={authorStats.authors.length}
        rowRenderer={renderRow}
      />
    </CollapsibleGroup>
  );

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
