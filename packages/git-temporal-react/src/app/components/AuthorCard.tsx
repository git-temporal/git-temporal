import React from 'react';
import { style } from 'app/styles';

import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';
import { CommaNumber } from 'app/components/CommaNumber';
import { PercentBar } from 'app/components/PercentBar';

export interface AuthorCardProps {
  author: any;
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

// numbers for humans have commas
export const AuthorCard = (props: AuthorCardProps): JSX.Element => {
  const { author, maxImpact, maxCommits } = props;

  return (
    <div style={style('card', 'flexRows', props.style)}>
      <AuthorGravatarImage emails={author.authorEmails} />
      <div style={style(identifiersStyle)}>
        <div title={author.authorEmails.join(', ')}>{author.authorName}</div>
        <div style={style(barLabelStyle)}>
          <span style={style('linesAdded')}>
            +<CommaNumber value={author.linesAdded} />
          </span>
          <span> / </span>
          <span style={style('linesDeleted')}>
            -<CommaNumber value={author.linesDeleted} />
          </span>
        </div>
        <PercentBar
          numerator={author.linesAdded + author.linesDeleted}
          denominator={maxImpact}
        />
        <div style={style(barLabelStyle)}>{author.totalCommits} Commits</div>
        <PercentBar numerator={author.totalCommits} denominator={maxCommits} />
      </div>
    </div>
  );
};
