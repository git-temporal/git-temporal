import React from 'react';
import { mountConnected } from 'testHelpers';

import { DifferenceViewerHeader } from './DifferenceViewerHeader';

describe('containers/DifferenceViewerHeader', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<DifferenceViewerHeader />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<DifferenceViewerHeader />);

      // from redux mock store data, we should see....
      wrapper.getByText('Jan 12, 2020, 4 AM');
      wrapper.getByText('(#94932bed) (Local HEAD)');
    });
  });
});
