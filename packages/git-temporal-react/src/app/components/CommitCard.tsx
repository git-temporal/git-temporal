import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';

export interface CommitCardProps {
  commit: ICommit;
  style?: string | object;
}

const defaultCardStyle = {
  _extends: 'card',
  display: 'block',
};

export const CommitCard = (props: CommitCardProps): JSX.Element => {
  const { commit } = props;
  return (
    <div style={style(defaultCardStyle, props.style)}> {commit.message} </div>
  );
};
