import React from 'react';
import { Files } from './Files';

import { mountConnected } from 'testHelpers';

describe('containers/Files', () => {
  describe('when rendered mock files and stats', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Files />);
      expect(wrapper.container).toMatchSnapshot();
    });
    it('should be showing 19 files', () => {
      const { wrapper } = mountConnected(<Files />);
      wrapper.getByText('19 Files');
    });
  });
});
