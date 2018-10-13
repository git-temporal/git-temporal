import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

import { EpochDate } from 'app/components/EpochDate';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { CommitBody } from 'app/components/CommitBody';

export interface CommitCardProps {
  commit: ICommit;
  index?: number;
  isExpanded?: boolean;
  onClick?: (evt, commit: ICommit, index: number) => void;
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

const constrainedBodyStyle = {
  maxHeight: 70,
  overflow: 'hidden',
  marginBottom: 10,
  boxShadow: 'rgba(245, 245, 245, 0.5) 0px -34px 11px -18px inset',
};

export const CommitCard = (props: CommitCardProps): JSX.Element => {
  const { commit, isExpanded } = props;
  const outerOverrideStyle = isExpanded ? 'selected' : {};
  const bodyStyle =
    isExpanded || commit.body.trim() === '' ? {} : constrainedBodyStyle;
  return (
    <div
      style={style(defaultCardStyle, props.style, outerOverrideStyle)}
      onClick={evt => props.onClick(evt, commit, props.index)}
    >
      <div style={style(dateLineStyle)}>
        <EpochDate epochTime={commit.authorDate} />
        <span style={{ marginLeft: 60 }}>{commit.hash}</span>
        <AddedDeleted
          linesAdded={commit.linesAdded}
          linesDeleted={commit.linesDeleted}
        />
      </div>
      <div style={style(messageStyle)}>{commit.message}</div>
      <div style={style(bodyStyle)}>
        <CommitBody text={commit.body} />
      </div>
      <div style={style(authorStyle)}>
        Authored by {commit.authorName} {commit.relativeDate}
      </div>
    </div>
  );
};
