import * as path from 'path';
import { createSelector } from 'reselect';

import { IDiff } from 'app/interfaces';
import { FilesContainerSorts } from 'app/actions/ActionTypes';

import { getFilesContainerSort, getSearch, getDiff } from './stateVars';
import { hasSearch, matchesFileSearch, fileSearchRegex } from './search';
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

export const getFilteredFilesForFilesContainer = createSelector(
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

export const getDirectoryDiff = createSelector(
  getDiff,
  (diff: IDiff | null) => {
    if (!diff || !diff.isDirectory) {
      return null;
    }
    const leftTree = {};
    const rightTree = {};

    if (!diff.modifiedFiles) {
      return {};
    }
    let index = 0;
    diff.modifiedFiles.forEach(file => {
      let trees = [];
      switch (file.status) {
        case 'added':
          trees = [rightTree];
          break;
        case 'deleted':
          trees = [leftTree];
          break;
        case 'modified':
          trees = [leftTree, rightTree];
          break;
      }
      for (const tree of trees) {
        let currentNode = tree;
        const parsedPaths = file.path.split(path.sep);
        parsedPaths.forEach((pathPart, pathPartIndex) => {
          let nodeForPart = currentNode[pathPart];
          if (!nodeForPart) {
            nodeForPart = currentNode[pathPart] = {
              index,
              status: file.status,
              delta: file.delta,
              fullPath: parsedPaths.slice(0, pathPartIndex + 1).join(path.sep),
              nodes: {},
            };
            index += 1;
          } else {
            nodeForPart.status =
              file.status === 'modified' ? 'modified' : nodeForPart.status;
            nodeForPart.delta = nodeForPart.delta + file.delta;
          }
          currentNode = nodeForPart.nodes;
        });
      }
    });
    return {
      leftTree,
      rightTree,
    };
  }
);
