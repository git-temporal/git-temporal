export enum ActionTypes {
  SELECT_PATH = 'SELECT_PATH',

  REQUEST_COMMITS = 'REQUEST_COMMITS',
  RECEIVE_COMMITS = 'RECEIVE_COMMITS',
  RECEIVE_COMMIT_RANGE = 'RECEIVED_COMMIT_RANGE',
  RECEIVED_All_COMMITS = 'RECEIVED_All_COMMITS',
  HIGHLIGHT_COMMITS = 'HIGHLIGHT_COMMITS',

  REQUEST_DIFF = 'REQUEST_DIFF',
  RECEIVE_DIFF = 'RECEIVE_DIFF',
  REQUEST_DEFERRED_DIFF = 'REQUEST_DEFERRED_DIFF',

  SET_SEARCH = 'SET_SEARCH',
  SET_AUTHORS_CONTAINER_SORT = 'SET_AUTHORS_CONTAINER_SORT',
  SET_COMMITS_CONTAINER_SORT = 'SET_COMMITS_CONTAINER_SORT',
  SET_FILES_CONTAINER_SORT = 'SET_FILES_CONTAINER_SORT',
  SET_START_DATE = 'SET_START_DATE',
  SET_END_DATE = 'SET_END_DATE',
  SET_OPEN_SIDEPANEL_GROUP = 'SET_OPEN_SIDEPANEL_GROUP',

  REQUEST_RERENDER = 'REQUEST_RERENDER',
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

export enum CollapsibleSidePanelGroups {
  AUTHORS = 'authors',
  COMMITS = 'commits',
  FILES = 'files',
}
