import {
  ActionTypes,
  AuthorsContainerSorts,
  CommitsContainerSorts,
  FilesContainerSorts,
  CollapsibleSidePanelGroups,
} from './ActionTypes';

import { fetchCommitsIfNeeded } from 'app/actions/commits';

export const selectPath = path => (dispatch, _getState) => {
  // if this comes from a rename, follow the most current name
  const actualPath = path.replace(/\{(.*)\s=>\s(.*)\}/g, '$2');

  dispatch(fetchCommitsIfNeeded(actualPath));
  return { selectedPath: actualPath, type: ActionTypes.SELECT_PATH };
};

export const setAuthorsContainerSort = (sort: AuthorsContainerSorts) => ({
  sort,
  type: ActionTypes.SET_AUTHORS_CONTAINER_SORT,
});

export const setSearch = (search: string) => ({
  search,
  type: ActionTypes.SET_SEARCH,
});

export const setStartDate = (startDate: number) => ({
  startDate,
  type: ActionTypes.SET_START_DATE,
});

export const setEndDate = (endDate: number) => ({
  endDate,
  type: ActionTypes.SET_END_DATE,
});

export const setCommitsContainerSort = (sort: CommitsContainerSorts) => ({
  sort,
  type: ActionTypes.SET_COMMITS_CONTAINER_SORT,
});

export const setFilesContainerSort = (sort: FilesContainerSorts) => ({
  sort,
  type: ActionTypes.SET_FILES_CONTAINER_SORT,
});

export const setOpenSidePanelGroup = (group: CollapsibleSidePanelGroups) => ({
  group,
  type: ActionTypes.SET_OPEN_SIDEPANEL_GROUP,
});

export const highlightCommits = commitIds => ({
  commitIds,
  type: ActionTypes.HIGHLIGHT_COMMITS,
});

// the timeplot and the monaco editor are native components that
// will update on data changes, but need to be told to rerender whenever
// the dimensions of their containers change. Like for example, when
// the side panel is opened or closed.
export const requestRerender = () => ({ type: ActionTypes.REQUEST_RERENDER });
