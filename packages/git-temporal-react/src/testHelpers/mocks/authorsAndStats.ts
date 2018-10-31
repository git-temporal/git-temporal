import fiveCommits from 'testHelpers/mocks/fiveCommits';

const authorsAndStats = {
  authors: [
    {
      authorName: 'Dan Abramov',
      authorEmails: ['dan.abramov@gmail.com', 'gaearon@fb.com'],
      linesAdded: 129276,
      linesDeleted: 104642,
      commits: fiveCommits,
    },
    {
      authorName: 'Paul O’Shannessy',
      authorEmails: ['paul@oshannessy.com'],
      linesAdded: 80522,
      linesDeleted: 125411,
      commits: fiveCommits,
    },
    {
      authorName: 'Brian Vaughn',
      authorEmails: ['bvaughn@fb.com', 'brian.david.vaughn@gmail.com'],
      linesAdded: 70314,
      linesDeleted: 74382,
      commits: fiveCommits,
    },
    {
      authorName: 'Andrew Clark',
      authorEmails: ['acdlite@me.com', 'acdlite@fb.com'],
      linesAdded: 82409,
      linesDeleted: 51329,
      commits: fiveCommits,
    },
    {
      authorName: 'Ben Alpert',
      authorEmails: [
        'ben@benalpert.com',
        'balpert@fb.com',
        'spicyjalapeno@gmail.com',
      ],
      linesAdded: 79669,
      linesDeleted: 32243,
      commits: fiveCommits,
    },
  ],
  totalLinesAdded: 442190,
  totalLinesDeleted: 388007,
  totalCommits: 3211,
  maxImpact: 233918,
  maxCommits: 919,
  authorsContainerSort: 'lines',
};

export default authorsAndStats;
