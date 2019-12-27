import { createSelector } from 'reselect';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

import { hasSearch, commitsMatchSearch } from './search';
import {
  hasDates,
  commitsMatchDates,
  getDefaultedStartDate,
  getDefaultedEndDate,
} from './dates';

import {
  getCommits,
  getCommitsContainerSort,
  getSearch,
  getStartDate,
  getEndDate,
} from './stateVars';
import { endDate } from 'app/reducers';

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getCommits,
  getSearch,
  getStartDate,
  getEndDate,
  getDefaultedStartDate,
  getDefaultedEndDate,

  (
    commits,
    search,
    startDate,
    endDate,
    defaultedStartDate,
    defaultedEndDate
  ) => {
    const filteredCommits =
      !hasSearch(search) && !hasDates(startDate, endDate)
        ? commits.slice(0)
        : commits.filter(commit => {
            return (
              commitsMatchSearch(commit, search) &&
              commitsMatchDates(commit, defaultedStartDate, defaultedEndDate)
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

export const getAreCommitsFiltered = createSelector(
  getStartDate,
  getEndDate,
  getSearch,

  (startDate, endDate, search) => {
    return startDate || endDate || (search != null && search.trim().length > 0);
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

export const getAuthorDateRange = createSelector(
  getFilteredCommits,
  commits => {
    let minAuthorDate = Date.now();
    let maxAuthorDate = 0;

    for (const commit of commits) {
      if (commit.authorDate < minAuthorDate) {
        minAuthorDate = commit.authorDate;
      }
      if (commit.authorDate > maxAuthorDate) {
        maxAuthorDate = commit.authorDate;
      }
    }

    return {
      minAuthorDate,
      maxAuthorDate,
    };
  }
);
