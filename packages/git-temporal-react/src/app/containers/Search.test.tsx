import React from 'react';
import { mountConnected } from 'testHelpers';

import { Search } from './Search';

describe('containers/Search', () => {
  describe('when rendered with mock redux store', () => {
    it('should match snapshot', () => {
      const { wrapper } = mountConnected(<Search />);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it('should render all of the things', async () => {
      const { wrapper } = mountConnected(<Search />);

      // from redux mock store data, we should see....
      wrapper.getByTestId('searchIcon');
      wrapper.getByPlaceholderText('search authors, files or commits');
    });
  });
});
