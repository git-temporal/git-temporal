import { createSelector } from 'reselect';

export const getSelectedPath = state => state.selectedPath;
const getCommitsByPath = state => state.commitsByPath;

// returns all commits for the current path
export const getAllCommits = createSelector(
  getSelectedPath,
  getCommitsByPath,
  (selectedPath, commitsByPath) => {
    return (
      commitsByPath[selectedPath] || {
        isFetching: true,
        commits: [],
      }
    );
  }
);

const sumImpact = commits => {
  const impact = { linesAdded: 0, linesDeleted: 0 };
  for (const commit of commits) {
    impact.linesAdded += commit.linesAdded;
    impact.linesDeleted += commit.linesDeleted;
  }
  return impact;
};

// returns array of
export const getAuthorsAndCommits = createSelector(getAllCommits, commits => {
  const commitsByAuthor = {};
  commits.commits.forEach(commit => {
    const commitsForThisAuthor = commitsByAuthor[commit.authorName] || [];
    commitsForThisAuthor.push(commit);
    commitsByAuthor[commit.authorName] = commitsForThisAuthor;
  });
  const authorsAndCommits = [];
  for (const authorName in commitsByAuthor) {
    const authorsCommits = commitsByAuthor[authorName];
    const { linesAdded, linesDeleted } = sumImpact(authorsCommits);
    authorsAndCommits.push({
      authorName,
      linesAdded,
      linesDeleted,
      commits: authorsCommits,
    });
  }
  return authorsAndCommits.sort((a, b) => {
    return b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted);
  });
});

export const getAuthorNames = createSelector(
  getAuthorsAndCommits,
  authorsAndCommits => {
    return authorsAndCommits.map(ac => ac.authorName);
  }
);

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getSelectedPath,
  getAllCommits,
  getAuthorNames,
  (selectedPath, commits, authorNames) => {
    return {
      selectedPath,
      authorNames,
      commits: commits.commits,
      isFetching: commits.isFetching,
    };
  }
);
