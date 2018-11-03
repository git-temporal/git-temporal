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

export interface ICommitsContainerState {
  selectedPath: string;
  highlightedCommitId: string;
  viewCommitsOrFiles?: string;
  commits: ICommit[];
  isFetching: boolean;
  didInvalidate: boolean;
  isFileSelected: boolean;
  commitsContainerSort: string;
}

export interface IAuthorStats {
  authorName: string;
  authorEmails: string[];
  linesAdded: number;
  linesDeleted: number;
  commits: ICommit[];
  firstCommitOn: number;
  lastCommitOn: number;
}
export interface IAuthorsContainerState {
  authors?: any[];
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
  authorsContainerSort: string;
}

export interface IFileStats {
  fileName: string;
  authorNames: string[];
  linesAdded: number;
  linesDeleted: number;
  commits: ICommit[];
  firstCommitOn: number;
  lastCommitOn: number;
}
export interface IFilesContainerState {
  files?: IFileStats[];
  isFileSelected: boolean;
  filesContainerSort: string;
}

export interface ITimeplotContainerState {
  selectedPath: string;
  highlightedCommitId: string;
  commits: ICommit[];
  authors: number;
}
