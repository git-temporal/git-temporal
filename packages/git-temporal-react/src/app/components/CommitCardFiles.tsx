import React from 'react';
import { style } from 'app/styles';

import { ICommitFile } from 'app/interfaces';

import { AddedDeleted } from 'app/components/AddedDeleted';
import { EllipsizedFileName } from 'app/components/EllipsizedFileName';

export interface CommitCardFilesProps {
  files: ICommitFile[];
  isExpanded?: boolean;
  style?: object;
  onFileClick?: (evt, fileName: string) => void;
}

const defaultContainerStyle = {
  marginBottom: 10,
};

const renderNone = () => {
  return <span>No files effected</span>;
};

const renderFile = (file: ICommitFile, index, onClick) => {
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
        onClick={onClick}
      />
    </div>
  );
};

const renderFiles = (files: ICommitFile[], onFileClick) => {
  return files.map((file, index) => renderFile(file, index, onFileClick));
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
          ? renderFiles(props.files, props.onFileClick)
          : renderSummary(props.files)}
    </div>
  );
};

CommitCardFiles.displayName = 'CommitCardFiles';
