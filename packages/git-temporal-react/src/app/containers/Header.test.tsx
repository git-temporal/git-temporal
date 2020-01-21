import React from 'react';
import { mountConnected } from 'testHelpers';

import { Header } from './Header';

describe('containers/Header', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Header />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<Header />);

      // from redux mock store data, we should see....
      wrapper.getByText('(repository root)');
      wrapper.getByText('October 24, 2019, 3 PM PDT');
      wrapper.getByText('January 12, 2020, 4 AM PST');

      const pathParts = await wrapper.findAllByTestId('pathPath');
      // 2 directories up from repo root + 1 for "(repository root)"
      expect(pathParts.length).toEqual(3);
    });
  });
});
