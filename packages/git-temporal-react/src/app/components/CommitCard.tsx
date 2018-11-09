import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

import { EpochDateTime } from 'app/components/EpochDateTime';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { CommitBody } from 'app/components/CommitBody';
import { CommitCardFiles } from 'app/components/CommitCardFiles';
import { MenuItem } from 'app/components/MenuItem';

export interface CommitCardProps {
  commit: ICommit;
  index?: number;
  isExpanded?: boolean;
  hideFiles?: boolean;
  hideCommitBody?: boolean;
  onClick?: (evt, commit: ICommit, index: number) => void;
  onFileClick?: (evt, fileName: string) => void;
  style?: string | object;
}

const defaultCardStyle = {
  _extends: ['card', 'block'],
  borderBottom: '1px solid whitesmoke',
  // wrapping in MenuItem provides sufficient margins and padding
  marginBottom: 0,
  marginRight: 0,
  padding: 0,
};

const dateLineStyle = {
  _extends: ['smallerText', 'block', 'flexRows'],
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

const dateDisplayOptions = {
  month: 'long',
  minute: 'numeric',
};

export const CommitCard = (props: CommitCardProps): JSX.Element => {
  const { commit, isExpanded, onFileClick } = props;
  const outerOverrideStyle = isExpanded ? 'selected' : {};
  return (
    <div style={style(defaultCardStyle, props.style, outerOverrideStyle)}>
      <MenuItem
        onClick={evt =>
          props.onClick && props.onClick(evt, commit, props.index)
        }
      >
        <div style={style(dateLineStyle)}>
          <EpochDateTime
            value={commit.authorDate}
            displayOptions={dateDisplayOptions}
          />
          <span style={{ flexGrow: 1, textAlign: 'center' }}>
            {commit.hash}
          </span>
          <AddedDeleted
            linesAdded={commit.linesAdded}
            linesDeleted={commit.linesDeleted}
          />
        </div>
        <div style={style(messageStyle)}>{commit.message}</div>
        {!props.hideCommitBody && (
          <CommitBody text={commit.body} isExpanded={isExpanded} />
        )}
        {!props.hideFiles && (
          <CommitCardFiles
            files={commit.files}
            isExpanded={isExpanded}
            style={filesStyle}
            onFileClick={onFileClick}
          />
        )}
        <div style={style(authorStyle)}>
          Authored by {commit.authorName} {commit.relativeDate}
        </div>
      </MenuItem>
    </div>
  );
};

CommitCard.displayName = 'CommitCard';
