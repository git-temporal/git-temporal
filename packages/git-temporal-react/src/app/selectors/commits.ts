import { createSelector } from 'reselect';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

import { hasSearch, commitsMatchSearch } from './search';

import { getCommits, getCommitsContainerSort, getSearch } from './stateVars';

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getCommits,
  getCommitsContainerSort,
  getSearch,

  (commits, commitsContainerSort, search) => {
    const filteredCommits = !hasSearch(search)
      ? commits.slice(0)
      : commits.filter(commit => {
          return commitsMatchSearch(commit, search);
        });

    return filteredCommits.sort((a, b) => {
      switch (commitsContainerSort) {
        case CommitsContainerSorts.LINES:
          return (
            b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted)
          );
        case CommitsContainerSorts.TIME:
          return b.authorDate - a.authorDate;
      }
      return 0;
    });
  }
);
