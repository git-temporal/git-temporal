import React from 'react';
import { shallow } from 'enzyme';

import fiveCommits from 'testHelpers/mocks/fiveCommits';

import { AuthorCard } from './AuthorCard';

const testProps = {
  author: {
    authorName: 'Zaphod Beeblebrox',
    authorEmails: ['president@galaxy.gov'],
    linesAdded: 100,
    linesDeleted: 30,
    commits: fiveCommits,
    firstCommitOn: 132344525,
    lastCommitOn: 132344555,
    isFiltered: false,
  },
  totalLinesAdded: 200,
  totalLinesDeleted: 60,
  totalCommits: 5,
  maxImpact: 260,
  maxCommits: 140,
};

describe('components/AuthorCard', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<AuthorCard {...testProps} />);
    });

    test('it should match snapshot (bars should be at 50%)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
