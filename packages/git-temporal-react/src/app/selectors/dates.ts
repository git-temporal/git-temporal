export const hasDates = (startDate, endDate) => {
  return startDate || endDate;
};

export const commitsMatchDates = (commit, startDate, endDate) => {
  if (!hasDates(startDate, endDate)) {
    return true;
  }
  const defaultedStartDate = startDate || 0;
  // @ts-ignore
  const defaultedEndDate = endDate || Math.floor(new Date() / 1000);
  const commits = Array.isArray(commit) ? commit : [commit];
  return commits.some(commit => {
    return (
      defaultedStartDate <= commit.authorDate &&
      commit.authorDate <= defaultedEndDate
    );
  });
};
