import { createSelector } from 'reselect';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

import { hasSearch, commitsMatchSearch } from './search';
import { hasDates, commitsMatchDates } from './dates';

import {
  getCommits,
  getCommitsContainerSort,
  getSearch,
  getStartDate,
  getEndDate,
} from './stateVars';

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getCommits,
  getSearch,
  getStartDate,
  getEndDate,

  (commits, search, startDate, endDate) => {
    const filteredCommits =
      !hasSearch(search) && !hasDates(startDate, endDate)
        ? commits.slice(0)
        : commits.filter(commit => {
            return (
              commitsMatchSearch(commit, search) &&
              commitsMatchDates(commit, startDate, endDate)
            );
          });

    return filteredCommits;
  }
);

export const getFirstFilteredCommit = createSelector(
  getFilteredCommits,
  commits => {
    return commits[0];
  }
);

export const getLastFilteredCommit = createSelector(
  getFilteredCommits,
  commits => {
    return commits[commits.length - 1];
  }
);

export const getFilteredSortedCommits = createSelector(
  getFilteredCommits,
  getCommitsContainerSort,
  (commits, commitsContainerSort) => {
    return commits.sort((a, b) => {
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

// commits in the timeplot respect the search filter but not the date
// filters
export const getCommitsForTimeplot = createSelector(
  getCommits,
  getSearch,

  (commits, search) => {
    const filteredCommits = !hasSearch(search)
      ? commits.slice(0)
      : commits.filter(commit => {
          return commitsMatchSearch(commit, search);
        });

    return filteredCommits;
  }
);
