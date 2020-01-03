import {
  ActionTypes,
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
  CollapsibleSidePanelGroups,
} from 'app/actions/ActionTypes';

export const rerenderRequestedAt = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.REQUEST_RERENDER:
      return Date.now();
    default:
      return state;
  }
};

export const authorsContainerSort = (
  state = AuthorsContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const search = (state = '', action: any) => {
  switch (action.type) {
    case ActionTypes.SET_SEARCH:
      return action.search;
  }
  return state;
};

export const commitsContainerSort = (
  state = CommitsContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_COMMITS_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const filesContainerSort = (
  state = FilesContainerSorts.TIME,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_FILES_CONTAINER_SORT:
      return action.sort;
  }
  return state;
};

export const openSidePanelGroup = (
  state = CollapsibleSidePanelGroups.AUTHORS,
  action: any
) => {
  switch (action.type) {
    case ActionTypes.SET_OPEN_SIDEPANEL_GROUP:
      return action.group;
  }
  return state;
};
