import { createSelector } from 'reselect';

import { ICommit } from 'app/interfaces';
import { getStartDate, getEndDate, getCommits } from 'app/selectors/stateVars';

export const getDefaultedStartDate = createSelector(
  getStartDate,
  getCommits,
  defaultStartDate
);

export function defaultStartDate(startDate, commits) {
  return (
    startDate ||
    (commits && commits.length > 0 && commits[commits.length - 1].authorDate) ||
    0
  );
}

export const getDefaultedEndDate = createSelector(
  getEndDate,
  getCommits,
  defaultEndDate
);

export function defaultEndDate(endDate, commits) {
  return (
    endDate ||
    (commits && commits.length > 0 && commits[0].authorDate) || // @ts-ignore
    Math.floor((new Date() as any) / 1000)
  );
}

export const hasDates = (startDate, endDate) => {
  return startDate || endDate;
};

export const commitsMatchDates = (commit, startDate, endDate) => {
  if (!hasDates(startDate, endDate)) {
    return true;
  }
  const commits = Array.isArray(commit) ? commit : [commit];
  return commits.some(commit => isWithinDates(commit, startDate, endDate));
};

export function dateFilteredCommits(commits, startDate, endDate) {
  if (!commits) {
    return null;
  }
  return commits.filter(commit => isWithinDates(commit, startDate, endDate));
}

function isWithinDates(
  commit: ICommit,
  startDate: number,
  endDate: number
): boolean {
  return startDate <= commit.authorDate && commit.authorDate <= endDate;
}
