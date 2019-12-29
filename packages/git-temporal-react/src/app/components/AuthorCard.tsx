import React from 'react';
import { style } from 'app/styles';

import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { PercentBar } from 'app/components/PercentBar';
import { EpochSpan } from 'app/components/EpochSpan';
import { Selectable } from 'app/components/Selectable';

import { IAuthorStats } from 'app/interfaces';

export interface AuthorCardProps {
  author: IAuthorStats;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  totalCommits: number;
  maxImpact: number;
  maxCommits: number;
  onClick: (evt, commit: IAuthorStats, index: number) => void;
  isHighlighted?: boolean;
  index?: number;
  style?: string | object;
}

const menuItemStyle = {
  fontSize: 'initial',
  display: 'flex',
  padding: 10,
  width: '100%',
};

const identifiersStyle = {
  _extends: 'flexColumn',
  width: '100%',
  marginLeft: 10,
};
const authorNameStyle = {
  marginBottom: 5,
};

const addedDeletedStyle = {
  float: 'none',
};

export const AuthorCard = (props: AuthorCardProps): JSX.Element => {
  const { author, maxImpact, maxCommits, index, isHighlighted } = props;
  const addStyles = isHighlighted ? 'selected' : {};

  return (
    <div style={style('flexRow', props.style)}>
      <Selectable
        style={style(menuItemStyle, addStyles)}
        onClick={evt => props.onClick(evt, author, index)}
      >
        <AuthorGravatarImage emails={author.authorEmails} />
        <div style={style(identifiersStyle)}>
          <div
            title={author.authorEmails.join(', ')}
            style={style(authorNameStyle)}
          >
            {author.authorName}
          </div>

          <div style={style('smallerText')}>
            <div>
              {author.commits.length}
              <span> commits spanning </span>
              <EpochSpan
                firstEpochTime={author.firstCommitOn}
                secondEpochTime={author.lastCommitOn}
              />
            </div>
          </div>

          <div style={style('smallerText')}>
            <span>Last commit </span>
            <EpochSpan
              firstEpochTime={author.lastCommitOn}
              secondEpochTime={Date.now() / 1000}
            />
            <span> ago</span>
          </div>
          <div style={style('smallerText')}>
            <AddedDeleted
              linesAdded={author.linesAdded}
              linesDeleted={author.linesDeleted}
              style={style(addedDeletedStyle)}
            />
            <span> lines changed </span>
          </div>
        </div>
      </Selectable>
    </div>
  );
};
