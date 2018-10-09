import React from 'react';
import { style } from 'app/styles';

import { IFileStats } from 'app/interfaces';

import { CommaNumber } from 'app/components/CommaNumber';
import { EpochSpan } from 'app/components/EpochSpan';
import { EllipsizedFileName } from 'app/components/EllipsizedFileName';

export interface FileCardProps {
  file: IFileStats;
  style?: string | object;
}

const defaultCardStyle = {
  _extends: 'card',
  display: 'block',
};

export const FileCard = (props: FileCardProps): JSX.Element => {
  const { file } = props;
  return (
    <div style={style(defaultCardStyle, props.style)}>
      <EllipsizedFileName
        fileName={file.fileName}
        maxCharacters={47}
        style={style('largerText', { display: 'block' })}
      />
      <div style={style('smallerText', { float: 'right' })}>
        <span style={style('linesAdded')}>
          +<CommaNumber value={file.linesAdded} />
        </span>
        <span> / </span>
        <span style={style('linesDeleted')}>
          -<CommaNumber value={file.linesDeleted} />
        </span>
      </div>
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
