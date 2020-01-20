import React from 'react';
import { Authors } from './Authors';

import { mountConnected } from 'testHelpers';

describe('containers/Authors', () => {
  describe('when rendered mock authors and stats', () => {
    let wrapper;
    beforeAll(() => {
      ({ wrapper } = mountConnected(<Authors />));
    });

    it('should be showing 7 authors', () => {
      wrapper.getByText('7 Authors');
    });
  });
});
