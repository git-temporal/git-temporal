import React from 'react';
import { mountConnected } from 'testHelpers';

import { Stats } from './Stats';

describe('containers/Stats', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Stats />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<Stats />);

      // from redux mock store data, we should see....
      wrapper.getAllByText('Selected Time Span');
    });
  });
});
