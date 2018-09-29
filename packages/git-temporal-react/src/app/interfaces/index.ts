export interface GitTemporalProps {
  // If not provided, the whole repository is assumed
  path?: string | null;
  serviceBaseUrl?: string;
}

export interface StateProps {
  items: ICommit[];
  isFetching: boolean;
  isEmpty: boolean;
  didInvalidate: boolean;
  lastUpdated: number;
  commits: ICommit[];
}

export interface DispatchProps {
  selectPath: (path: string) => void;
  invalidatePath: (path: string) => void;
  requestCommits: (path: string) => void;
  receiveCommits: (path: string, json: ICommit[]) => void;
  fetchCommitsIfNeeded: (path: string) => void;
  dispatch: (action: any) => void;
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
