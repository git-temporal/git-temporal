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

const filterButtonStyle = {
  position: 'absolute',
  right: 5,
  top: 2,
  padding: '5px 5px 3px 5px',
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
