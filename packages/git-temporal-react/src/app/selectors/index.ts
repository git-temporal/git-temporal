import { createSelector } from 'reselect';

import {
  AuthorsContainerSorts,
  AuthorsContainerFilters,
} from 'app/actions/ActionTypes';

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

export const getFilteredAuthors = state => state.filteredAuthors || [];
export const getAuthorsContainerFilter = state => state.authorsContainerFilter;
export const getAuthorsContainerSort = state => state.authorsContainerSort;

const sumImpact = commits => {
  const impact = { linesAdded: 0, linesDeleted: 0 };
  for (const commit of commits) {
    impact.linesAdded += commit.linesAdded;
    impact.linesDeleted += commit.linesDeleted;
  }
  return impact;
};

// returns array of all authors NOT filtered by filteredAuthors, and commits
export const getAuthorsAndCommits = createSelector(
  getCommits,
  getAuthorsContainerSort,
  (commits, authorsContainerSort) => {
    const commitsByAuthor = {};
    commits.forEach(commit => {
      const commitsForThisAuthor = commitsByAuthor[commit.authorName] || {
        authorName: commit.authorName,
        authorEmails: [],
        commits: [],
        firstCommitOn: commit.authorDate,
        lastCommitOn: commit.authorDate,
      };
      if (
        commitsForThisAuthor.authorEmails.indexOf(commit.authorEmail) === -1
      ) {
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
      switch (authorsContainerSort) {
        case AuthorsContainerSorts.LINES:
          return (
            b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted)
          );
        case AuthorsContainerSorts.COMMITS:
          return b.commits.length - a.commits.length;
        case AuthorsContainerSorts.TIME:
          return b.lastCommitOn - a.lastCommitOn;
      }
      return 0;
    });
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
export const getFilteredCommits = createSelector(
  getCommits,
  getFilteredAuthors,
  (commits, filteredAuthors) => {
    if (!filteredAuthors || filteredAuthors.length <= 0) {
      return commits;
    }
    return commits.filter(commit => {
      return filteredAuthors.indexOf(commit.authorName) !== -1;
    });
  }
);

// returns an array of
// {
//   fileName: string,
//   commits: ICommit[],
//   linesAdded: number,
//   linesDeleted: number
// }
export const getFilteredFiles = createSelector(getFilteredCommits, commits => {
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

export const getHeaderContainerState = createSelector(
  getSelectedPath,
  getFilteredAuthors,
  (selectedPath, filteredAuthors) => ({
    selectedPath,
    filteredAuthors,
  })
);

export const getAuthorsActionMenuState = createSelector(
  getAuthorsContainerFilter,
  getAuthorsContainerSort,
  getFilteredAuthors,
  (authorsContainerFilter, authorsContainerSort, filteredAuthors) => ({
    authorsContainerFilter,
    authorsContainerSort,
    filteredAuthors,
  })
);

const filterAuthorsForAuthorsContainer = (
  authors,
  filteredAuthors,
  authorsContainerFilter
) => {
  if (
    !filteredAuthors ||
    filteredAuthors.length === 0 ||
    authorsContainerFilter === AuthorsContainerFilters.ALL
  ) {
    return authors;
  }
  return authors.filter(author => {
    return filteredAuthors.indexOf(author.authorName) !== -1;
  });
};

// note that the authors container state is not filtered by filteredAuthors
export const getAuthorsContainerState = createSelector(
  getAuthorsAndCommits,
  getFilteredAuthors,
  getAuthorsContainerFilter,
  getAuthorsContainerSort,
  (
    authorsAndCommits,
    filteredAuthors,
    authorsContainerFilter,
    authorsContainerSort
  ) => {
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
      const isFiltered =
        filteredAuthors && filteredAuthors.indexOf(ac.authorName) !== -1;
      if (impact > maxImpact) {
        maxImpact = impact;
      }
      if (ac.commits.length > maxCommits) {
        maxCommits = ac.commits.length;
      }
      return {
        isFiltered,
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
      filteredAuthors,
      authorsContainerSort,
      authorsContainerFilter,
      authors: filterAuthorsForAuthorsContainer(
        authorsArray,
        filteredAuthors,
        authorsContainerFilter
      ),
    };
  }
);

export const getFilesContainerState = createSelector(
  getFilteredFiles,
  getIsFileSelected,
  (files, isFileSelected) => ({
    files,
    isFileSelected,
  })
);

export const getStatsContainerState = createSelector(
  getFilteredCommits,
  getFilteredFiles,
  getViewCommitsOrFiles,
  getIsFileSelected,
  getAuthorsAndCommits,
  getFilteredAuthors,
  (
    commits,
    files,
    viewCommitsOrFiles,
    isFileSelected,
    authorsAndCommits,
    filteredAuthors
  ) => {
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
      authors: filteredAuthors.length || authorsAndCommits.length,
      commits: commits.length,
      files: files.length,
      linesAdded: totalLinesAdded,
      linesDeleted: totalLinesDeleted,
    };
  }
);
