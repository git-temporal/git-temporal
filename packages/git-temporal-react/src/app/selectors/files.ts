import { createSelector } from 'reselect';

import { FilesContainerSorts } from 'app/actions/ActionTypes';

import { getFilesContainerSort, getSearch, getSelectedPath } from './stateVars';
import { getFilteredCommits } from './commits';

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
