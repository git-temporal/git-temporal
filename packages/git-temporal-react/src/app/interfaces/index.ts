export type CommitsOrFilesType = 'commits' | 'files';

export interface GitTemporalProps {
  // If not provided, the whole repository is assumed
  path?: string;
  serviceBaseUrl?: string;
  viewCommitsOrFiles?: string; // CommitsOrFilesType;
}

export interface StateProps {
  selectedPath?: string;
  commits?: ICommit[];
  isFetching?: boolean;
  isEmpty?: boolean;
  didInvalidate?: boolean;
  lastUpdated?: number;
}

export interface DispatchProps {
  dispatch?: (action: any) => void;
}

export interface TestProps {
  testId?: string;
}

export interface ICommitFile {
  name: string;
  linesAdded: number;
  linesDeleted: number;
}

export interface ICommit {
  id: string;
  authorName: string;
  relativeDate: string;
  authorDate: number;
  message: string;
  body: string;
  hash: string;
  linesAdded: number;
  linesDeleted: number;
  files: ICommitFile[];
}

export interface IFilteredCommitsState {
  selectedPath: string;
  highlightedCommitId: string;
  // TODO:  why doesn't the correct way work?  "The computer says, 'No'"
  viewCommitsOrFiles?: string; // CommitsOrFilesType;
  commits: ICommit[];
  isFetching: boolean;
  didInvalidate: boolean;
  isFileSelected: boolean;
}

export interface IAuthorStats {
  authorName: string;
  authorEmails: string[];
  linesAdded: number;
  linesDeleted: number;
  totalCommits: number;
  firstCommitOn: number;
  lastCommitOn: number;
  isFiltered: boolean;
}
export interface IAuthorsAndStats {
  authors?: any[];
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
  filteredAuthors: string[];
  authorsContainerFilter: string;
  authorsContainerSort: string;
}

export interface IFileStats {
  fileName: string;
  authorNames: string[];
  linesAdded: number;
  linesDeleted: number;
  commits: number;
  firstCommitOn: number;
  lastCommitOn: number;
}
export interface IFilesContainerState {
  files?: IFileStats[];
  isFileSelected: boolean;
}
