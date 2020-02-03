import React from 'react';
import { fireEvent } from '@testing-library/react';
import { mountConnected } from 'testHelpers';

import { Commits } from './Commits';

describe('containers/Commits', () => {
  describe('when rendered for directory', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Commits />);
      expect(wrapper.container).toMatchSnapshot();
    });
    it('should be showing 8 commits with files changed', () => {
      const { wrapper, store } = mountConnected(<Commits />, {
        openSidePanelGroup: 'commits',
      });
      wrapper.getByText('8 Commits');
      expect(store.getState().isFileSelected).toEqual(false);
      const filesChangedEls = wrapper.getAllByText(/\d* files? changed/);
      expect(filesChangedEls.length).toEqual(8);
    });
  });
  describe('when rendered for file', () => {
    it('should not show files in commits', () => {
      const { wrapper, store } = mountConnected(<Commits />, {
        openSidePanelGroup: 'commits',
        isFileSelected: true,
      });
      wrapper.getByText('8 Commits');
      expect(store.getState().isFileSelected).toEqual(true);
      const filesChangedEls = wrapper.queryAllByText(/\d* files? changed/);
      expect(filesChangedEls.length).toEqual(0);
    });
  });
  describe('when card clicked', () => {
    it('should set highlighted commits', () => {
      const { wrapper, store } = mountConnected(<Commits />, {
        openSidePanelGroup: 'commits',
      });
      expect(store.getState().highlightedCommitIds).toEqual([]);
      const commitCards = wrapper.getAllByTestId('commit-card');
      expect(commitCards.length).toEqual(8);
      fireEvent.click(commitCards[0]);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
