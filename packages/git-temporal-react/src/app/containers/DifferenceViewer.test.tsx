import React from 'react';
import { mountConnected } from 'testHelpers';

import { DifferenceViewer } from './DifferenceViewer';

describe('containers/DifferenceViewer', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<DifferenceViewer />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<DifferenceViewer />);

      // from redux mock store data, we should see....
      wrapper.getAllByText('cra-template-typescript');
    });
  });
});
