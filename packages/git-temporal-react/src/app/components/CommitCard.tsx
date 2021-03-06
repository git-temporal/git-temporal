import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

import { EpochDateTime } from 'app/components/EpochDateTime';
import { AddedDeleted } from 'app/components/AddedDeleted';
import { CommitBody } from 'app/components/CommitBody';
import { CommitCardFiles } from 'app/components/CommitCardFiles';
import { Selectable } from 'app/components/Selectable';

export interface CommitCardProps {
  commit: ICommit;
  index?: number;
  isExpanded?: boolean;
  isHighlighted?: boolean;
  hideFiles?: boolean;
  hideCommitBody?: boolean;
  onClick?: (evt, commit: ICommit, index: number) => void;
  onDoubleClick?: (evt, commit: ICommit, index: number) => void;
  onFileClick?: (evt, fileName: string) => void;
  style?: string | object;
}

const defaultCardStyle = {
  _extends: ['card', 'block'],
  marginRight: 0,
  padding: 0,
};

const dateLineStyle = {
  _extends: ['smallerText', 'block', 'flexRow'],
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
  const {
    commit,
    isExpanded,
    isHighlighted,
    onFileClick,
    onClick,
    onDoubleClick,
    index,
  } = props;
  const outerOverrideStyle = isHighlighted ? 'selected' : {};
  return (
    <div style={style(defaultCardStyle, props.style, outerOverrideStyle)}>
      <Selectable
        testId="commit-card"
        onClick={evt => onClick && onClick(evt, commit, index)}
        onDoubleClick={evt =>
          onDoubleClick && onDoubleClick(evt, commit, index)
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
      </Selectable>
    </div>
  );
};

CommitCard.displayName = 'CommitCard';
