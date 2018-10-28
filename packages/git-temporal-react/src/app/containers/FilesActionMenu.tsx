import React, { Component } from 'react';
import { connect } from 'react-redux';
import { style } from 'app/styles';

import { DispatchProps } from 'app/interfaces';
import { getFilesActionMenuState } from 'app/selectors';
import { RadioMenuItem } from 'app/components/RadioMenuItem';
import { ActionMenu } from 'app/components/ActionMenu';

import { setFilesContainerSort } from 'app/actions';
import { FilesContainerSorts } from 'app/actions/ActionTypes';

interface FilesActionMenuProps {
  filesContainerSort?: FilesContainerSorts;
}

const containerStyle = {
  _extends: 'normalText',
  position: 'absolute',
  right: 10,
};

export class FilesActionMenu extends Component<
  FilesActionMenuProps & DispatchProps
> {
  render() {
    const { filesContainerSort } = this.props;
    return (
      <ActionMenu style={style(containerStyle)}>
        <div style={style('h5Text')}>Sort by</div>
        <RadioMenuItem
          testId="sortTime"
          onClick={() => {
            this.sortFiles(FilesContainerSorts.TIME);
          }}
          isSelected={filesContainerSort === FilesContainerSorts.TIME}
        >
          by time
        </RadioMenuItem>
        <RadioMenuItem
          testId="sortCommits"
          onClick={() => {
            this.sortFiles(FilesContainerSorts.COMMITS);
          }}
          isSelected={filesContainerSort === FilesContainerSorts.COMMITS}
        >
          by number of commits
        </RadioMenuItem>
        <RadioMenuItem
          testId="sortLines"
          onClick={() => {
            this.sortFiles(FilesContainerSorts.LINES);
          }}
          isSelected={filesContainerSort === FilesContainerSorts.LINES}
        >
          by lines changed
        </RadioMenuItem>
      </ActionMenu>
    );
  }

  sortFiles(newFilesContainerSort: FilesContainerSorts) {
    this.props.dispatch(setFilesContainerSort(newFilesContainerSort));
  }
}

export default connect(getFilesActionMenuState)(FilesActionMenu);
