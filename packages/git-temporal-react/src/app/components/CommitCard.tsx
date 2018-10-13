import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

import { EpochDate } from 'app/components/EpochDate';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { CommitBody } from 'app/components/CommitBody';
import { CommitCardFiles } from 'app/components/CommitCardFiles';

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
const filesStyle = {
  _extends: ['block', 'normalText'],
  marginLeft: 10,
  marginRight: 20,
  marginBottom: 10,
};

export const CommitCard = (props: CommitCardProps): JSX.Element => {
  const { commit, isExpanded } = props;
  const outerOverrideStyle = isExpanded ? 'selected' : {};
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
      <CommitBody text={commit.body} isExpanded={isExpanded} />
      <CommitCardFiles
        files={commit.files}
        isExpanded={isExpanded}
        style={filesStyle}
      />
      <div style={style(authorStyle)}>
        Authored by {commit.authorName} {commit.relativeDate}
      </div>
    </div>
  );
};
