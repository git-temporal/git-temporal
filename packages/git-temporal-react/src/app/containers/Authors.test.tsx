import React from 'react';
import { Authors } from './Authors';

import { mountConnected } from 'testHelpers';

describe('containers/Authors', () => {
  describe('when rendered mock authors and stats', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Authors />);
      expect(wrapper.container).toMatchSnapshot();
    });
    it('should be showing 7 authors', () => {
      const { wrapper } = mountConnected(<Authors />);
      wrapper.getByText('7 Authors');
    });
  });
});
