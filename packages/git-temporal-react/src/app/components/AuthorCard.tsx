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

const barLabelStyle = {
  _extends: 'smallerText',
  textAlign: 'right',
};
const identifiersStyle = {
  _extends: 'flexColumns',
  width: '100%',
  marginLeft: 10,
};
const authorNameStyle = {
  marginBottom: 5,
};

// numbers for humans have commas
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
        <div style={style(barLabelStyle)}>
          <AddedDeleted
            linesAdded={author.linesAdded}
            linesDeleted={author.linesDeleted}
          />
        </div>
        <PercentBar
          numerator={author.linesAdded + author.linesDeleted}
          denominator={maxImpact}
        />
        <div style={style('smallerText')}>
          {author.totalCommits}
          <span> commits spanning </span>
          <EpochSpan
            firstEpochTime={author.firstCommitOn}
            secondEpochTime={author.lastCommitOn}
          />
        </div>
        <PercentBar numerator={author.totalCommits} denominator={maxCommits} />
      </div>
    </div>
  );
};
