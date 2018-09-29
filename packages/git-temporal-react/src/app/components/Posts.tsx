import React from 'react';

const Commits = ({ commits }) => (
  <ul>
    {commits.map((commit, i) => (
      <li key={i}>{commit.title}</li>
    ))}
  </ul>
);

// Commits.propTypes = {
//   commits: PropTypes.array.isRequired,
// };

export default Commits;
