import React from 'react';
import { style } from 'app/styles';

import { ICommitFile } from 'app/interfaces';

import { AddedDeleted } from 'app/components/AddedDeleted';

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

const renderFile = (file: ICommitFile) => {
  return (
    <div style={{ marginBottom: 5, wordBreak: 'break-all' }}>
      <AddedDeleted
        linesAdded={file.linesAdded}
        linesDeleted={file.linesDeleted}
        style={{ marginLeft: 10 }}
      />
      <span>{file.name}</span>
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
