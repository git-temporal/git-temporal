import React from 'react';
import { style } from 'app/styles';
import { useSelector, useDispatch } from 'react-redux';

import { getHighlightedCommitIds } from 'app/selectors/stateVars';
import { highlightCommits, requestRerender, setSearch } from 'app/actions';

import { Stats } from 'app/containers/Stats';
import { Authors } from 'app/containers/Authors';
import { Files } from 'app/containers/Files';
import { Commits } from 'app/containers/Commits';
import { Search } from 'app/containers/Search';
import { ResetLink } from 'app/components/ResetLink';

import { CollapsibleSidePanel } from 'app/components/CollapsibleSidePanel';

const containerStyle = {
  _extends: ['altPanel'],
  overflow: 'hidden',
};

const searchAndResetStyle = {
  position: 'relative',
  minHeight: 60,
};

const resetStyle = {
  position: 'absolute',
  right: 5,
};

const resetHighlightsLinkStyle = {
  marginLeft: '@margins.large+px',
  marginTop: '@margins.small+px',
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
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <Stats />
        <div style={style(searchAndResetStyle)}>
          <Search />
          <ResetLink style={style(resetStyle)} onClick={onResetClick}>
            Reset Search
          </ResetLink>
        </div>
        <Authors />
        <Commits />
        <Files />
      </div>
    </CollapsibleSidePanel>
  );

  function onResetClick() {
    dispatch(highlightCommits([]));
    dispatch(setSearch(null));
  }

  function didOpenSidePanel() {
    dispatch(requestRerender());
  }

  function didCloseSidePanel() {
    dispatch(requestRerender());
  }
};
