import React from 'react';
import { shallow } from 'enzyme';

import { FileCard } from './FileCard';
import tenCommits from 'testHelpers/mocks/tenCommits';

const testProps = {
  file: {
    fileName: 'docs/js/react.js',
    authorNames: [
      'Daniel Lo Nigro',
      'Dan Abramov',
      'Linus Unnebäck',
      'tomocchino',
      'Paul O’Shannessy',
      'Scott Feeney',
      'Ben Alpert',
      'Jim',
      'Marjan',
    ],
    commits: tenCommits,
    linesAdded: 41962,
    linesDeleted: 41962,
    firstCommitOn: 1427579814,
    lastCommitOn: 1493211770,
  },
};

describe('components/FileCard', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<FileCard {...testProps} />);
    });

    test('it should match snapshot (bars should be at 50%)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
