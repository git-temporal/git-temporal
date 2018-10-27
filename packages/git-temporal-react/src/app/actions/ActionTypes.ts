export enum ActionTypes {
  REQUEST_COMMITS = 'REQUEST_COMMITS',
  RECEIVE_COMMITS = 'RECEIVE_COMMITS',
  SELECT_PATH = 'SELECT_PATH',
  INVALIDATE_PATH = 'INVALIDATE_PATH',
  HIGHLIGHT_COMMIT = 'HIGHLIGHT_COMMIT',
  VIEW_COMMITS = 'VIEW_COMMITS',
  VIEW_FILES = 'VIEW_FILES',
  SET_SEARCH = 'SET_SEARCH',
  SET_AUTHORS_CONTAINER_SORT = 'SET_AUTHORS_CONTAINER_SORT',
  SET_COMMITS_CONTAINER_SORT = 'SET_COMMITS_CONTAINER_SORT',
  SET_FILES_CONTAINER_SORT = 'SET_FILES_CONTAINER_SORT',
}

export enum AuthorsContainerSorts {
  TIME = 'time',
  LINES = 'lines',
  COMMITS = 'commits',
}

export enum CommitsContainerSorts {
  TIME = 'time',
  LINES = 'lines',
}

export enum FilesContainerSorts {
  TIME = 'time',
  LINES = 'lines',
  COMMITS = 'commits',
}
