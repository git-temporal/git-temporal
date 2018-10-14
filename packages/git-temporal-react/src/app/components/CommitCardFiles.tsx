import React from 'react';
import { style } from 'app/styles';

import { ICommitFile } from 'app/interfaces';

import { AddedDeleted } from 'app/components/AddedDeleted';
import { EllipsizedFileName } from 'app/components/EllipsizedFileName';

export interface CommitCardFilesProps {
  files: ICommitFile[];
  isExpanded?: boolean;
  style?: object;
}

const defaultContainerStyle = {
  marginBottom: 10,
};

const renderNone = () => {
  return <span>No files effected</span>;
};

const renderFile = (file: ICommitFile, index) => {
  return (
    <div key={index} style={{ wordBreak: 'break-all' }}>
      <AddedDeleted
        linesAdded={file.linesAdded}
        linesDeleted={file.linesDeleted}
      />
      <EllipsizedFileName
        style={style('smallerText')}
        fileName={file.name}
        maxCharacters={58}
      />
    </div>
  );
};

const renderFiles = (files: ICommitFile[]) => {
  return files.map(renderFile);
};

const renderSummary = (files: ICommitFile[]) => {
  const noun = files.length === 1 ? 'file' : 'files';
  // this is rendered as a link to suggest that they can expand the card
  // and see all files changed.  The card itself handles the click though
  return (
    <span style={style('link')}>
      {files.length} {noun} changed
    </span>
  );
};

export const CommitCardFiles = (props: CommitCardFilesProps): JSX.Element => {
  return (
    <div style={style(defaultContainerStyle, props.style)}>
      {props.files.length <= 0
        ? renderNone()
        : props.isExpanded
          ? renderFiles(props.files)
          : renderSummary(props.files)}
    </div>
  );
};
