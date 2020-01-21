import React from 'react';
import { Commits } from './Commits';

import { mountConnected } from 'testHelpers';

describe('containers/Commits', () => {
  describe('when rendered mock commits and stats', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Commits />);
      expect(wrapper.container).toMatchSnapshot();
    });
    it('should be showing 8 commits', () => {
      const { wrapper } = mountConnected(<Commits />);
      wrapper.getByText('8 Commits');
    });
  });
});
