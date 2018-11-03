import { createSelector } from 'reselect';

import {
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
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

export const getSearch = state => state.search;
export const getAuthorsContainerSort = state => state.authorsContainerSort;
export const getCommitsContainerSort = state => state.commitsContainerSort;
export const getFilesContainerSort = state => state.filesContainerSort;

const sumImpact = commits => {
  const impact = { linesAdded: 0, linesDeleted: 0 };
  for (const commit of commits) {
    impact.linesAdded += commit.linesAdded;
    impact.linesDeleted += commit.linesDeleted;
  }
  return impact;
};

const matchesSearch = (testText, searchText) => {
  if (!hasSearch(searchText)) {
    return true;
  }
  if (!testText) {
    return false;
  }
  const realSearchText = searchText.toString().toLowerCase();
  return testText.toLowerCase().includes(realSearchText);
};

const matchesAuthorSearch = (testText, searchText) => {
  return matchesSearch(
    testText,
    searchText.replace(/authors?\s*[\:\=]\s*/, '')
  );
};
const matchesCommitSearch = (testText, searchText) => {
  return matchesSearch(
    testText,
    searchText.replace(/commits?\s*[\:\=]\s*/, '')
  );
};

const fileSearchRegex = /files?\s*[\:\=]\s*/;

const matchesFileSearch = (testText, searchText) => {
  return matchesSearch(testText, searchText.replace(fileSearchRegex, ''));
};

const commitsMatchSearch = (commit, searchText) => {
  if (!hasSearch(searchText)) {
    return true;
  }
  const commits = !Array.isArray(commit) ? [commit] : commit;
  for (const commit of commits) {
    let matchesFileName = false;
    for (const file of commit.files) {
      matchesFileName = matchesFileSearch(file.name, searchText);
      if (matchesFileName) {
        break;
      }
    }
    if (
      matchesFileName ||
      matchesCommitSearch(commit.message, searchText) ||
      matchesCommitSearch(commit.id, searchText) ||
      matchesCommitSearch(commit.body, searchText) ||
      matchesAuthorSearch(commit.authorName, searchText) ||
      matchesAuthorSearch(commit.authorEmail, searchText)
    ) {
      return true;
    }
  }
  return false;
};

const getObjectValues = function(obj) {
  const values = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
};

const hasSearch = searchText => {
  return searchText && searchText.toString().trim() !== '';
};

// returns commits for the current path filtered by selected authors
// and time range
export const getFilteredCommits = createSelector(
  getCommits,
  getCommitsContainerSort,
  getSearch,

  (commits, commitsContainerSort, search) => {
    const filteredCommits = !hasSearch(search)
      ? commits
      : commits.filter(commit => {
          return commitsMatchSearch(commit, search);
        });

    return filteredCommits.sort((a, b) => {
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

export const getAuthorsAndCommits = createSelector(
  getFilteredCommits,
  getAuthorsContainerSort,
  (commits, authorsContainerSort) => {
    const commitsByAuthor = {};
    commits.forEach(commit => {
      const commitsForThisAuthor = commitsByAuthor[commit.authorName] || {
        authorName: commit.authorName,
        authorEmails: [],
        commits: [],
        files: {},
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
      for (const file of commit.files) {
        commitsForThisAuthor[file.fileName] = true;
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
      authorAndCommits.files = Object.keys(authorAndCommits.files);
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
// returns an array of
// {
//   fileName: string,
//   commits: ICommit[],
//   linesAdded: number,
//   linesDeleted: number
// }
export const getFilteredFiles = createSelector(
  getFilteredCommits,
  getFilesContainerSort,
  getSearch,
  (commits, filesContainerSort) => {
    const commitsByFile = {};
    for (const commit of commits) {
      if (!commit.files) {
        continue;
      }
      for (const file of commit.files) {
        const thisFile = commitsByFile[file.name] || {
          fileName: file.name,
          authorNames: [],
          commits: [],
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
        thisFile.commits.push(commit);
        commitsByFile[file.name] = thisFile;
      }
    }
    // files are filtered by virtual of getFilteredCommits
    const filteredFiles = getObjectValues(commitsByFile);

    return filteredFiles.sort((a, b) => {
      switch (filesContainerSort) {
        case FilesContainerSorts.LINES:
          return (
            b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted)
          );
        case FilesContainerSorts.TIME:
          return b.lastCommitOn - a.lastCommitOn;
        case FilesContainerSorts.COMMITS:
          return b.commits.length - a.commits.length;
      }
      return 0;
    });
  }
);

export const getIsFileSelected = createSelector(
  getSelectedPath,
  getFilteredFiles,
  (selectedPath, files) => {
    return files.length === 1 && files[0].fileName === selectedPath;
  }
);

export const getCommitsActionMenuState = createSelector(
  getCommitsContainerSort,
  commitsContainerSort => ({
    commitsContainerSort,
  })
);

export const getFilteredCommitsState = createSelector(
  getSelectedPath,
  getViewCommitsOrFiles,
  getHighlightedCommitId,
  getFilteredCommits,
  getIsFileSelected,
  getIsFetching,
  getDidInvalidate,
  getCommitsContainerSort,
  getSearch,
  (
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate,
    commitsContainerSort,
    search
  ) => ({
    selectedPath,
    viewCommitsOrFiles,
    highlightedCommitId,
    commits,
    isFileSelected,
    isFetching,
    didInvalidate,
    commitsContainerSort,
    search,
  })
);

export const getHeaderContainerState = createSelector(
  getSelectedPath,
  getSearch,
  (selectedPath, search) => ({
    selectedPath,
    search,
  })
);

export const getAuthorsActionMenuState = createSelector(
  getAuthorsContainerSort,
  authorsContainerSort => ({
    authorsContainerSort,
  })
);

export const getAuthorsContainerState = createSelector(
  getAuthorsAndCommits,
  getAuthorsContainerSort,
  getSearch,
  (authorsAndCommits, authorsContainerSort, search) => {
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
        ...ac,
      };
    });

    return {
      totalLinesAdded,
      totalLinesDeleted,
      totalCommits,
      maxImpact,
      maxCommits,
      authorsContainerSort,
      search,
      authors: authorsArray,
    };
  }
);

const getFilteredFilesForFilesContainer = createSelector(
  getFilteredFiles,
  getSearch,
  (files, search) => {
    // if the user specifically searched for files on show those in files container
    // otherwise all files in any commits with this file would also show up here
    if (hasSearch(search) && search.match(fileSearchRegex)) {
      return files.filter(file => {
        return matchesFileSearch(file.fileName, search);
      });
    }
    return files;
  }
);
export const getFilesActionMenuState = createSelector(
  getFilesContainerSort,
  filesContainerSort => ({
    filesContainerSort,
  })
);

export const getFilesContainerState = createSelector(
  getFilteredFilesForFilesContainer,
  getIsFileSelected,
  getFilesContainerSort,
  getSearch,
  (files, isFileSelected, filesContainerSort, search) => ({
    files,
    isFileSelected,
    filesContainerSort,
    search,
  })
);

export const getStatsContainerState = createSelector(
  getFilteredCommits,
  getFilteredFilesForFilesContainer,
  getViewCommitsOrFiles,
  getIsFileSelected,
  getAuthorsAndCommits,
  (commits, files, viewCommitsOrFiles, isFileSelected, authorsAndCommits) => {
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

export const getTimeplotContainerState = createSelector(
  getSelectedPath,
  getHighlightedCommitId,
  getCommits,
  getAuthorsAndCommits,
  (selectedPath, highlightedCommitId, commits, authorsAndCommits) => ({
    selectedPath,
    highlightedCommitId,
    commits,
    authors: authorsAndCommits.length,
  })
);
