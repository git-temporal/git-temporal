import React, { useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { debug } from '@git-temporal/logger';

import { highlightCommits, selectPath } from 'app/actions';
import { getFilteredSortedCommits } from 'app/selectors/commits';
import {
  getHighlightedCommitIds,
  getCommitsContainerSort,
} from 'app/selectors/stateVars';
import { style } from 'app/styles';
import { ExtendingList } from 'app/components/ExtendingList';
import { CommitCard } from 'app/components/CommitCard';
import CommitsActionMenu from './CommitsActionMenu';
import { CollapsibleGroup } from 'app/components/CollapsibleGroup';

const scrollStyle = {
  flexGrow: 1,
  overflow: 'auto',
  marginBotton: '@margins.large+px',
};

export const Commits: React.FC = (): React.ReactElement => {
  const commits = useSelector(getFilteredSortedCommits);
  const highlightedCommitIds = useSelector(getHighlightedCommitIds);
  const dispatch = useDispatch();

  const title = `${commits.length} Commits`;

  return (
    <CollapsibleGroup title={title}>
      <CommitsActionMenu />
      <ExtendingList rowCount={commits.length} rowRenderer={renderRow} />
    </CollapsibleGroup>
  );

  function renderRow(index: number, key: string | number) {
    // debug('render row', row);
    const commit = commits[index];
    let isHighlighted = false;
    let isExpanded = false;
    if (highlightedCommitIds && highlightedCommitIds.length > 0) {
      isHighlighted = highlightedCommitIds.includes(commit.id);
      isExpanded = highlightedCommitIds[0] === commit.id;
    }

    return (
      <div key={key}>
        <CommitCard
          commit={commit}
          index={index}
          isHighlighted={isHighlighted}
          isExpanded={isExpanded}
          onClick={onCommitCardClick}
          onFileClick={onFileClick}
          hideFiles={false}
        />
      </div>
    );
  }

  function onCommitCardClick(event, commit, index) {
    event.stopPropagation();
    let newHighlightedCommitIds = [commit.id];
    if (highlightedCommitIds && highlightedCommitIds.length > 0) {
      const index = highlightedCommitIds.indexOf(commit.id);
      if (index !== -1) {
        // moving it to the top causes it to also be the expanded
        // commit card.
        newHighlightedCommitIds = newHighlightedCommitIds.concat(
          highlightedCommitIds
            .slice(0, index)
            .concat(highlightedCommitIds.slice(index + 1))
        );
      }
    }
    dispatch(highlightCommits(newHighlightedCommitIds));
  }

  function onFileClick(event, fileName) {
    event.stopPropagation();
    dispatch(selectPath(fileName));
  }
};
