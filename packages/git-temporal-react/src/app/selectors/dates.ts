import { ICommit } from 'app/interfaces';

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
  return commits.filter(commit => isWithinDates(commit, startDate, endDate));
}

function getDefaultedStartDate(startDate: number): number {
  return startDate || 0;
}

function getDefaultedEndDate(endDate: number): number {
  // @ts-ignore
  return endDate || Math.floor(new Date() / 1000);
}

function isWithinDates(
  commit: ICommit,
  startDate: number,
  endDate: number
): boolean {
  const defaultedStartDate = getDefaultedStartDate(startDate);
  const defaultedEndDate = getDefaultedEndDate(endDate);
  return (
    defaultedStartDate <= commit.authorDate &&
    commit.authorDate <= defaultedEndDate
  );
}
