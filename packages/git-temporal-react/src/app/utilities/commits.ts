import { dateFromEpochDate } from './dates';

export function getUTCDateOfCommit(commit) {
  return dateFromEpochDate(commit.authorDate);
}

export function getHourOfCommit(commit) {
  const d = getUTCDateOfCommit(commit);
  return d.getHours();
}

export function filterCommitsForSpan(commits, dateStart, dateEnd) {
  return commits.filter(commit => {
    const commitDate = getUTCDateOfCommit(commit);
    return dateStart <= commitDate && commitDate <= dateEnd;
  });
}

export function first20CommitsEqual(commitsA, commitsB) {
  if (commitsA.length !== commitsB.length) {
    return false;
  }
  for (let i = 0; i < 20 && i < commitsA.length; i++) {
    if (commitsA[i].id !== commitsB[i].id) {
      return false;
    }
  }
  return true;
}
