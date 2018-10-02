export interface GitTemporalProps {
  // If not provided, the whole repository is assumed
  path?: string | null;
  serviceBaseUrl?: string;
}

export interface StateProps {
  commits?: ICommit[];
  isFetching?: boolean;
  isEmpty?: boolean;
  didInvalidate?: boolean;
  lastUpdated?: number;
}

export interface DispatchProps {
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
