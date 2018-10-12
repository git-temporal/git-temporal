import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

import { EpochDate } from 'app/components/EpochDate';
import { CommaNumber } from 'app/components/CommaNumber';
import { EpochSpan } from 'app/components/EpochSpan';
import { CommitBody } from 'app/components/CommitBody';

export interface CommitCardProps {
  commit: ICommit;
  style?: string | object;
}

const defaultCardStyle = {
  _extends: ['card', 'block'],
  borderBottom: '1px solid whitesmoke',
};

const dateLineStyle = {
  _extends: ['smallerText', 'block'],
};
const messageStyle = {
  _extends: ['largerText', 'block'],
  marginLeft: 5,
};
const authorStyle = {
  _extends: ['normalText', 'block'],
  marginLeft: 5,
};

export const CommitCard = (props: CommitCardProps): JSX.Element => {
  const { commit } = props;
  return (
    <div style={style(defaultCardStyle, props.style)}>
      <div style={style(dateLineStyle)}>
        <EpochDate epochTime={commit.authorDate} />
        <span style={{ marginLeft: 60 }}>{commit.hash}</span>
        <span style={style('smallerText', { float: 'right' })}>
          <span style={style('linesAdded')}>
            +<CommaNumber value={commit.linesAdded} />
          </span>
          <span> / </span>
          <span style={style('linesDeleted')}>
            -<CommaNumber value={commit.linesDeleted} />
          </span>
        </span>
      </div>
      <div style={style(messageStyle)}>{commit.message}</div>
      <CommitBody text={commit.body} />
      <div style={style(authorStyle)}>
        Authored by {commit.authorName}{' '}
        <EpochSpan
          firstEpochTime={commit.authorDate}
          secondEpochTime={Date.now() / 1000}
        />{' '}
        ago
      </div>
    </div>
  );
};
