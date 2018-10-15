import React from 'react';
import { style } from 'app/styles';

import { IFileStats } from 'app/interfaces';

import { AddedDeleted } from 'app/components/AddedDeleted';
import { EpochSpan } from 'app/components/EpochSpan';
import { EllipsizedFileName } from 'app/components/EllipsizedFileName';

export interface FileCardProps {
  file: IFileStats;
  style?: string | object;
  onFileClick?: (evt, fileName: string) => void;
}

const defaultCardStyle = {
  _extends: 'card',
  display: 'block',
};

export const FileCard = (props: FileCardProps): JSX.Element => {
  const { file, onFileClick } = props;
  return (
    <div style={style(defaultCardStyle, props.style)}>
      <EllipsizedFileName
        fileName={file.fileName}
        maxCharacters={47}
        style={style('largerText', { display: 'block' })}
        onClick={onFileClick}
      />
      <AddedDeleted
        linesAdded={file.linesAdded}
        linesDeleted={file.linesDeleted}
      />{' '}
      <div style={style('normalText')}>
        <span>
          {file.commits} commits by {file.authorNames.length} authors spanning{' '}
        </span>
        <EpochSpan
          firstEpochTime={file.firstCommitOn}
          secondEpochTime={file.lastCommitOn}
        />
      </div>
    </div>
  );
};
