import React from 'react';
import { mountConnected } from 'testHelpers';

import Timeplot from './Timeplot';

describe('containers/Timeplot', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      debugger;
      const { wrapper } = mountConnected(<Timeplot />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<Timeplot />);

      // from redux mock store data, we should see....
      wrapper.getByTestId('timeplotGraph');
    });
  });
});
