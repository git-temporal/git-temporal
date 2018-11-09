import React from 'react';
import { style } from 'app/styles';

export interface EllipsizedFileNameProps {
  fileName: string;
  maxCharacters: number;
  style?: object | string;
  onClick?: (evt, fileName: string) => void;
}

export function ellipsizeFileName(
  fileName: string,
  maxCharacters: number
): string {
  const lengthIn = fileName.length;
  if (lengthIn > maxCharacters) {
    const overCount = lengthIn - maxCharacters + 4;
    const fileNameParts = fileName.split('/');
    let eliminatedCount = 0;
    let rightPath = '';
    for (let i = 2; i < fileNameParts.length - 1; i++) {
      const filePart = fileNameParts[i];
      if (eliminatedCount < overCount) {
        eliminatedCount += filePart.length + 1;
      } else {
        rightPath += `/${filePart}`;
      }
    }
    return `${fileNameParts[0]}/...${rightPath}/${
      fileNameParts[fileNameParts.length - 1]
    }`;
    // return `...${fileName.slice(lengthIn - maxCharacters + 3)}`;
  }
  return fileName;
}
export const EllipsizedFileName = (
  props: EllipsizedFileNameProps
): JSX.Element => {
  return (
    <span title={props.fileName} style={style(props.style)}>
      {renderFileNameLink(props.fileName, props.maxCharacters, props.onClick)}
    </span>
  );
};

EllipsizedFileName.displayName = 'EllipsizedFileName';

const renderFileNameLink = (
  fileName: string,
  maxCharacters: number,
  onClick?
): JSX.Element | string => {
  const ellipsized = ellipsizeFileName(fileName, maxCharacters);
  if (!onClick) {
    return ellipsized;
  }
  return (
    <a onClick={evt => onClick(evt, fileName)} style={style('link')}>
      {ellipsized}
    </a>
  );
};
