import React from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { style } from 'app/styles';
import { getHighlightedCommitIds } from 'app/selectors/stateVars';
import { highlightCommits, requestRerender } from 'app/actions';

import Stats from 'app/containers/Stats';
import Authors from 'app/containers/Authors';
import Files from 'app/containers/Files';
import Commits from 'app/containers/Commits';
import Search from 'app/containers/Search';

import { CollapsibleSidePanel } from 'app/components/CollapsibleSidePanel';
import { ResetLink } from 'app/components/ResetLink';

const containerStyle = {
  _extends: ['altPanel'],
  overflow: 'auto',
};

const searchAndResetStyle = {
  float: 'right',
  position: 'relative',
  minHeight: 60,
};

const resetHighlightsLinkStyle = {
  marginLeft: '@margins.large',
  marginTop: '@margins.small',
};

export const SidePanel: React.FC = (): React.ReactElement => {
  const highlightedCommitIds = useSelector(getHighlightedCommitIds);
  const dispatch = useDispatch();

  return (
    <CollapsibleSidePanel
      style={containerStyle}
      onOpen={didOpenSidePanel}
      onClose={didCloseSidePanel}
    >
      <div style={style(searchAndResetStyle)}>
        <Search />
        {highlightedCommitIds.length > 0 && (
          <ResetLink
            style={style(resetHighlightsLinkStyle)}
            onClick={onResetHighlightedCommits}
          >
            Reset search, filters & highlights
          </ResetLink>
        )}
      </div>
      <Stats />
      <Authors />
      <Commits />
      <Files />
    </CollapsibleSidePanel>
  );

  function onResetHighlightedCommits() {
    dispatch(highlightCommits([]));
  }

  function didOpenSidePanel() {
    dispatch(requestRerender());
  }

  function didCloseSidePanel() {
    dispatch(requestRerender());
  }
};
