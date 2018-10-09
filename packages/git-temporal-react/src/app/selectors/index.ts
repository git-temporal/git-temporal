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
    const commitsForThisAuthor = commitsByAuthor[commit.authorName] || {
      authorName: commit.authorName,
      authorEmails: [],
      commits: [],
    };
    if (commitsForThisAuthor.authorEmails.indexOf(commit.authorEmail) === -1) {
      commitsForThisAuthor.authorEmails.push(commit.authorEmail);
    }
    commitsForThisAuthor.commits.push(commit);
    commitsByAuthor[commit.authorName] = commitsForThisAuthor;
  });
  const authorsAndCommits = [];
  for (const key in commitsByAuthor) {
    const authorAndCommits = commitsByAuthor[key];
    const { linesAdded, linesDeleted } = sumImpact(authorAndCommits.commits);
    authorAndCommits.linesAdded = linesAdded;
    authorAndCommits.linesDeleted = linesDeleted;
    authorsAndCommits.push(authorAndCommits);
  }
  return authorsAndCommits.sort((a, b) => {
    return b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted);
  });
});

export const getAuthorsAndStats = createSelector(
  getAuthorsAndCommits,
  authorsAndCommits => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let totalCommits = 0;
    let maxImpact = 0;
    let maxCommits = 0;

    const authorsArray = authorsAndCommits.map(ac => {
      totalCommits += ac.commits.length;
      totalLinesDeleted += ac.linesDeleted;
      totalLinesAdded += ac.linesAdded;
      const impact = ac.linesAdded + ac.linesDeleted;
      if (impact > maxImpact) {
        maxImpact = impact;
      }
      if (ac.commits.length > maxCommits) {
        maxCommits = ac.commits.length;
      }
      return {
        authorName: ac.authorName,
        authorEmails: ac.authorEmails,
        linesAdded: ac.linesAdded,
        linesDeleted: ac.linesDeleted,
        totalCommits: ac.commits.length,
      };
    });
    return {
      totalLinesAdded,
      totalLinesDeleted,
      totalCommits,
      maxImpact,
      maxCommits,
      authors: authorsArray,
    };
  }
);

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getSelectedPath,
  getAllCommits,
  (selectedPath, commits) => {
    return {
      selectedPath,
      commits: commits.commits,
      isFetching: commits.isFetching,
    };
  }
);

const getObjectValues = function(obj) {
  const values = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
};

// returns an array of
// {
//   fileName: string,
//   commits: ICommit[],
//   linesAdded: number,
//   linesDeleted: number
// }

export const getFilesAndCommits = createSelector(getAllCommits, commits => {
  const commitsByFile = {};
  for (const commit of commits.commits) {
    if (!commit.files) {
      continue;
    }
    for (const file of commit.files) {
      const thisFile = commitsByFile[file.name] || {
        fileName: file.name,
        commits: [],
        linesAdded: 0,
        linesDeleted: 0,
      };
      thisFile.linesAdded += file.linesAdded;
      thisFile.linesDeleted += file.linesDeleted;
      thisFile.commits.push(commit);
      commitsByFile[file.name] = thisFile;
    }
  }
  return getObjectValues(commitsByFile).sort((a, b) => {
    return b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted);
  });
});

export const getFilteredStats = createSelector(
  getAllCommits,
  getAuthorsAndCommits,
  getFilesAndCommits,
  (allCommits, authorsAndCommits, filesAndCommits) => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let minAuthorDate = Date.now();
    let maxAuthorDate = 0;

    for (const commit of allCommits.commits) {
      totalLinesAdded += commit.linesAdded;
      totalLinesDeleted += commit.linesDeleted;
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
      authors: authorsAndCommits.length,
      commits: allCommits.commits.length,
      files: filesAndCommits.length,
      linesAdded: totalLinesAdded,
      linesDeleted: totalLinesDeleted,
    };
  }
);
