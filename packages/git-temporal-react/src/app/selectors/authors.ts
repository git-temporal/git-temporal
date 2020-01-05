import { createSelector } from 'reselect';
import { AuthorsContainerSorts } from 'app/actions/ActionTypes';
import { getAuthorsContainerSort } from './stateVars';
import { getFilteredCommits, getCommitsForTimeplot } from './commits';

export const getTimeplotAuthorsAndCommits = createSelector(
  getCommitsForTimeplot,
  getAuthorsContainerSort,
  commitsByAuthors
);

export const getAuthorsAndCommits = createSelector(
  getFilteredCommits,
  getAuthorsContainerSort,
  commitsByAuthors
);

function commitsByAuthors(commits, authorsContainerSort) {
  // TODO: dear prettier, this \/ looks like shit
  const { commitsByAuthorName, authorsAndCommitsByEmail } = collateCommits(
    commits
  );
  const authorsAndCommits = [];
  const deduped = dedupeAuthorsAndCommits(
    commitsByAuthorName,
    authorsAndCommitsByEmail
  );
  for (const key in deduped) {
    const authorAndCommits = commitsByAuthorName[key];
    const { linesAdded, linesDeleted } = sumImpact(authorAndCommits.commits);
    authorAndCommits.linesAdded = linesAdded;
    authorAndCommits.linesDeleted = linesDeleted;
    authorAndCommits.files = Object.keys(authorAndCommits.files);
    authorsAndCommits.push(authorAndCommits);
  }
  return authorsAndCommits.sort((a, b) => {
    switch (authorsContainerSort) {
      case AuthorsContainerSorts.LINES:
        return b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted);
      case AuthorsContainerSorts.COMMITS:
        return b.commits.length - a.commits.length;
      case AuthorsContainerSorts.TIME:
        return b.lastCommitOn - a.lastCommitOn;
    }
    return 0;
  });
}

export const getAuthorsStats = createSelector(
  getAuthorsAndCommits,
  getAuthorsContainerSort,
  authorsAndCommits => {
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let totalCommits = 0;
    let maxImpact = 0;
    let maxCommits = 0;

    const authorsArray = authorsAndCommits.map(ac => {
      totalCommits += ac.commits.length;
      totalLinesDeleted += ac.linesDeleted;
      totalLinesAdded += ac.linesAdded;
      const impact = ac.linesAdded + ac.linesDeleted;
      if (impact > maxImpact) {
        maxImpact = impact;
      }
      if (ac.commits.length > maxCommits) {
        maxCommits = ac.commits.length;
      }
      return {
        ...ac,
      };
    });

    return {
      totalLinesAdded,
      totalLinesDeleted,
      totalCommits,
      maxImpact,
      maxCommits,
      authors: authorsArray,
    };
  }
);

const sumImpact = commits => {
  const impact = { linesAdded: 0, linesDeleted: 0 };
  for (const commit of commits) {
    impact.linesAdded += commit.linesAdded;
    impact.linesDeleted += commit.linesDeleted;
  }
  return impact;
};

const consolidateAuthorAndCommits = (
  commitsByAuthorName,
  authorAndCommitsArray
) => {
  let authorAndCommitsResult = null;
  for (const authorAndCommits of authorAndCommitsArray) {
    if (!authorAndCommitsResult) {
      authorAndCommitsResult = authorAndCommits;
      delete commitsByAuthorName[authorAndCommits.authorName];
      continue;
    }
    if (
      authorAndCommits.authorName.length >
      authorAndCommitsResult.authorName.length
    ) {
      authorAndCommitsResult.authorName = authorAndCommits.authorName;
    }
    for (const email of authorAndCommits.authorEmails) {
      if (authorAndCommitsResult.authorEmails.indexOf(email) === -1) {
        authorAndCommitsResult.authorEmails.push(email);
      }
    }
    if (authorAndCommits.authorDate < authorAndCommitsResult.firstCommitOn) {
      authorAndCommitsResult.firstCommitOn = authorAndCommits.authorDate;
    }
    if (authorAndCommits.authorDate > authorAndCommitsResult.lastCommitOn) {
      authorAndCommitsResult.lastCommitOn = authorAndCommits.authorDate;
    }
    for (const file in authorAndCommits.files) {
      authorAndCommitsResult.files[file] = true;
    }
    authorAndCommitsResult.commits = authorAndCommitsResult.commits.concat(
      authorAndCommits.commits
    );
    delete commitsByAuthorName[authorAndCommits.authorName];
  }
  commitsByAuthorName[
    authorAndCommitsResult.authorName
  ] = authorAndCommitsResult;
  return authorAndCommitsResult;
};

const dedupeAuthorsAndCommits = (
  commitsByAuthorName,
  authorsAndCommitsByEmail
) => {
  for (const email in authorsAndCommitsByEmail) {
    const byEmail = authorsAndCommitsByEmail[email];
    if (byEmail.length <= 1) {
      continue;
    }
    consolidateAuthorAndCommits(commitsByAuthorName, byEmail);
  }
  return commitsByAuthorName;
};

const collateCommits = commits => {
  const commitsByAuthorName = {};
  const authorsAndCommitsByEmail = {};

  commits.forEach(commit => {
    const commitsForThisAuthor = commitsByAuthorName[commit.authorName] || {
      authorName: commit.authorName,
      authorEmails: [],
      commits: [],
      files: {},
      firstCommitOn: commit.authorDate,
      lastCommitOn: commit.authorDate,
    };
    if (commitsForThisAuthor.authorEmails.indexOf(commit.authorEmail) === -1) {
      commitsForThisAuthor.authorEmails.push(commit.authorEmail);
    }
    if (commit.authorDate < commitsForThisAuthor.firstCommitOn) {
      commitsForThisAuthor.firstCommitOn = commit.authorDate;
    }
    if (commit.authorDate > commitsForThisAuthor.lastCommitOn) {
      commitsForThisAuthor.lastCommitOn = commit.authorDate;
    }
    for (const file of commit.files) {
      commitsForThisAuthor.files[file] = true;
    }
    commitsForThisAuthor.commits.push(commit);
    commitsByAuthorName[commit.authorName] = commitsForThisAuthor;
    const byEmail = authorsAndCommitsByEmail[commit.authorEmail] || [];
    if (!byEmail.includes(commitsForThisAuthor)) {
      byEmail.push(commitsForThisAuthor);
      authorsAndCommitsByEmail[commit.authorEmail] = byEmail;
    }
  });
  return {
    commitsByAuthorName,
    authorsAndCommitsByEmail,
  };
};
