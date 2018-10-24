import React from 'react';
import { style } from 'app/styles';

import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { PercentBar } from 'app/components/PercentBar';
import { EpochSpan } from 'app/components/EpochSpan';
import { ToggleButton } from 'app/components/ToggleButton';
import { FilterIcon } from 'app/components/FilterIcon';

import { IAuthorStats } from 'app/interfaces';

export interface AuthorCardProps {
  author: IAuthorStats;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
  style?: string | object;
  onFilterToggle?: (evt) => void;
}

const identifiersStyle = {
  _extends: 'flexColumns',
  width: '100%',
  marginLeft: 10,
};
const authorNameStyle = {
  marginBottom: 5,
};

const filterButtonStyle = {
  position: 'absolute',
  right: 5,
  top: 2,
  padding: '5px 5px 3px 5px',
};

const addedDeletedStyle = {
  marginTop: 6,
};

export const AuthorCard = (props: AuthorCardProps): JSX.Element => {
  const { author, maxImpact, maxCommits, onFilterToggle } = props;

  return (
    <div style={style('card', 'flexRows', props.style)}>
      <ToggleButton
        isSelected={author.isFiltered}
        onClick={onFilterToggle}
        style={filterButtonStyle}
      >
        <FilterIcon />
      </ToggleButton>
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
