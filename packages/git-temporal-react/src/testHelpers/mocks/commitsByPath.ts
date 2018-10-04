import fiveCommits from './fiveCommits';
import tenCommits from './tenCommits';

const commitsByPath = {
  testPath1: {
    isFetching: false,
    commits: fiveCommits,
  },
  testPath2: {
    isFetching: false,
    commits: tenCommits,
  },
};

export default commitsByPath;
