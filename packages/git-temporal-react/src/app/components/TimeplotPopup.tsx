import React from 'react';
import { style } from 'app/styles';

import { ICommit } from 'app/interfaces';
import { Popup } from 'app/components/Popup';
import { DateTime } from 'app/components/DateTime';
import { CommitCard } from 'app/components/CommitCard';

export interface TimeplotPopupProps {
  // This is the text or JSX that gets wrapped in a Toggle Button
  commits: ICommit[];
  startDate: Date;
  endDate: Date;
  left: number;
  isOpen: boolean;
  onClose: () => void;
  onCommitSelected: (evt: object, commit: ICommit) => void;
  onMouseEnter?: (evt: object) => void;
  onMouseLeave?: (evt: object) => void;
  style?: string | object;
}

export const TIMEPLOT_POPUP_WIDTH = 350;

const defaultPopupStyle = {
  _extends: 'normalText',
  position: 'fixed',
  bottom: 200,
  width: TIMEPLOT_POPUP_WIDTH,
  right: 'initial',
  border: 'solid 2px @colors.selectable',
};

const headerStyle = {
  _extends: 'altPanel',
  // compensate for padding of panel to move this to the top, left & right edges
  marginRight: -10,
  marginTop: -10,
  marginLeft: -10,
};
const footerStyle = {
  _extends: ['altPanel', 'smallerText', 'flexColumns'],
  // compensate for padding of panel to move this to the bottom, left & right edges
  marginRight: -10,
  marginBottom: -10,
  marginLeft: -10,
};

const commitListStyle = {
  _extends: 'panel',
  maxHeight: 400,
  minHeight: 50,
  overflow: 'scroll',
  marginRight: 0,
};

export const TimeplotPopup = (props: TimeplotPopupProps): JSX.Element => {
  const {
    commits,
    startDate,
    endDate,
    isOpen,
    onClose,
    onCommitSelected,
  } = props;
  const popupStyle = {
    left: props.left,
  };
  if (!(commits && startDate && endDate)) {
    return null;
  }
  const commitsText =
    commits.length === 1 ? 'was one commit' : `were ${commits.length} commits`;
  return (
    <Popup
      style={style(defaultPopupStyle, popupStyle)}
      isOpen={isOpen}
      onClose={onClose}
      noBackdrop
    >
      <div>
        <div style={style(headerStyle)}>
          <div style={style('largerText')}>There {commitsText} between</div>
          <DateTime value={startDate} /> and <DateTime value={endDate} />
        </div>
        <div style={style(commitListStyle)}>
          {commits.map((commit, index) => (
            <CommitCard
              key={index}
              commit={commit}
              onClick={onCommitSelected}
              hideCommitBody
              hideFiles
            />
          ))}
        </div>
        <div style={style(footerStyle)}>
          <div style={style('flexRows')}>
            <div>Click to select left revision</div>
            <div style={{ flexGrow: 1, textAlign: 'right' }}>
              Shift + Click to select right revision
            </div>
          </div>
          <div style={style('flexRows', { marginTop: 5 })}>
            <div> Click twice to select a single commit</div>
            <div style={{ flexGrow: 1, textAlign: 'right' }}>
              ...or click and drag below
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};