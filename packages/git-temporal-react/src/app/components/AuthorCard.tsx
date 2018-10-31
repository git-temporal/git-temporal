import React from 'react';
import { style } from 'app/styles';

import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { PercentBar } from 'app/components/PercentBar';
import { EpochSpan } from 'app/components/EpochSpan';

import { IAuthorStats } from 'app/interfaces';

export interface AuthorCardProps {
  author: IAuthorStats;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
  style?: string | object;
}

const identifiersStyle = {
  _extends: 'flexColumns',
  width: '100%',
  marginLeft: 10,
};
const authorNameStyle = {
  marginBottom: 5,
};

const addedDeletedStyle = {
  marginTop: 6,
};

export const AuthorCard = (props: AuthorCardProps): JSX.Element => {
  const { author, maxImpact, maxCommits } = props;

  return (
    <div style={style('card', 'flexRows', props.style)}>
      <AuthorGravatarImage emails={author.authorEmails} />
      <div style={style(identifiersStyle)}>
        <div
          title={author.authorEmails.join(', ')}
          style={style(authorNameStyle)}
        >
          {author.authorName}
        </div>
        <div>
          <span style={style('smallerText')}>
            <EpochSpan
              firstEpochTime={author.lastCommitOn}
              secondEpochTime={Date.now() / 1000}
            />
            <span> ago</span>
          </span>
          <AddedDeleted
            linesAdded={author.linesAdded}
            linesDeleted={author.linesDeleted}
            style={style(addedDeletedStyle)}
          />
        </div>
        <PercentBar
          numerator={author.linesAdded + author.linesDeleted}
          denominator={maxImpact}
        />
        <div style={style('smallerText')}>
          {author.commits.length}
          <span> commits spanning </span>
          <EpochSpan
            firstEpochTime={author.firstCommitOn}
            secondEpochTime={author.lastCommitOn}
          />
        </div>
        <PercentBar
          numerator={author.commits.length}
          denominator={maxCommits}
        />
      </div>
    </div>
  );
};
