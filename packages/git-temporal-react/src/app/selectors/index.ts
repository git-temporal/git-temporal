import { createSelector } from 'reselect';

// const getState = state => {
//   return state;
// };

export const getSelectedPath = state => state.selectedPath;
export const getCommits = state => state.commits;
export const getIsFetching = state => state.isFetching;
export const getDidInvalidate = state => state.getDidInvalidate;
export const getHighlightedCommitId = state => state.highlightedCommitId;
export const getViewCommitsOrFiles = state =>
  state.viewCommitsOrFiles || 'commits';

const sumImpact = commits => {
  const impact = { linesAdded: 0, linesDeleted: 0 };
  for (const commit of commits) {
    impact.linesAdded += commit.linesAdded;
    impact.linesDeleted += commit.linesDeleted;
  }
  return impact;
};

// returns array of
export const getAuthorsAndCommits = createSelector(getCommits, commits => {
  const commitsByAuthor = {};
  commits.forEach(commit => {
    const commitsForThisAuthor = commitsByAuthor[commit.authorName] || {
      authorName: commit.authorName,
      authorEmails: [],
      commits: [],
      firstCommitOn: commit.authorDate,
      lastCommitOn: commit.authorDate,
    };
    if (commitsForThisAuthor.authorEmails.indexOf(commit.authorEmail) === -1) {
      commitsForThisAuthor.authorEmails.push(commit.authorEmail);
    }
    if (commit.authorDate < commitsForThisAuthor.firstCommitOn) {
      commitsForThisAuthor.firstCommitOn = commit.authorDate;
    }
    if (commit.authorDate > commitsForThisAuthor.lastCommitOn) {
      commitsForThisAuthor.lastCommitOn = commit.authorDate;
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
        firstCommitOn: ac.firstCommitOn,
        lastCommitOn: ac.lastCommitOn,
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

const getObjectValues = function(obj) {
  const values = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
};

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(getCommits, commits => {
  // TODO: filter returned commits by selected authors and date range
  return commits;
});

// returns an array of
// {
//   fileName: string,
//   commits: ICommit[],
//   linesAdded: number,
//   linesDeleted: number
// }
export const getFilteredFiles = createSelector(getCommits, commits => {
  const commitsByFile = {};
  for (const commit of commits) {
    if (!commit.files) {
      continue;
    }
    for (const file of commit.files) {
      const thisFile = commitsByFile[file.name] || {
        fileName: file.name,
        authorNames: [],
        commits: 0,
        linesAdded: 0,
        linesDeleted: 0,
        firstCommitOn: commit.authorDate,
        lastCommitOn: commit.authorDate,
      };
      if (thisFile.authorNames.indexOf(commit.authorName) === -1) {
        thisFile.authorNames.push(commit.authorName);
      }
      if (commit.authorDate < thisFile.firstCommitOn) {
        thisFile.firstCommitOn = commit.authorDate;
      }
      if (commit.authorDate > thisFile.lastCommitOn) {
        thisFile.lastCommitOn = commit.authorDate;
      }
      thisFile.linesAdded += file.linesAdded;
      thisFile.linesDeleted += file.linesDeleted;
      thisFile.commits += 1;
      commitsByFile[file.name] = thisFile;
    }
  }
  return getObjectValues(commitsByFile).sort((a, b) => {
    return b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted);
  });
});

export const getIsFileSelected = createSelector(
  getSelectedPath,
  getFilteredFiles,
  (selectedPath, files) => {
    return files.length === 1 && files[0].fileName === selectedPath;
  }
);

export const getFilteredCommitsState = createSelector(
  getSelectedPath,
  getViewCommitsOrFiles,
  getHighlightedCommitId,
  getFilteredCommits,
  getIsFileSelected,
  getIsFetching,
  getDidInvalidate,
  (
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate
  ) => ({
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate,
  })
);

export const getFilesContainerState = createSelector(
  getFilteredFiles,
  getIsFileSelected,
  (files, isFileSelected) => ({
    files,
    isFileSelected,
  })
);

export const getFilteredStats = createSelector(
  getCommits,
  getAuthorsAndCommits,
  getFilteredFiles,
  getViewCommitsOrFiles,
  getIsFileSelected,
  (commits, authorsAndCommits, files, viewCommitsOrFiles, isFileSelected) => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let minAuthorDate = Date.now();
    let maxAuthorDate = 0;

    for (const commit of commits) {
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
      viewCommitsOrFiles,
      isFileSelected,
      authors: authorsAndCommits.length,
      commits: commits.length,
      files: files.length,
      linesAdded: totalLinesAdded,
      linesDeleted: totalLinesDeleted,
    };
  }
);
