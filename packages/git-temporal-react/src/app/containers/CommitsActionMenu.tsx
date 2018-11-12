import React, { Component } from 'react';
import { connect } from 'react-redux';
import { style } from 'app/styles';

import { DispatchProps } from 'app/interfaces';
import { getCommitsActionMenuState } from 'app/selectors';
import { RadioMenuItem } from 'app/components/RadioMenuItem';
import { ActionMenu } from 'app/components/ActionMenu';

import { setCommitsContainerSort } from 'app/actions';
import { CommitsContainerSorts } from 'app/actions/ActionTypes';

interface CommitsActionMenuProps {
  commitsContainerSort?: CommitsContainerSorts;
}

interface CommitsActionMenuState {
  isMenuOpen: boolean;
}

const containerStyle = {
  _extends: 'normalText',
  position: 'absolute',
  right: 10,
};

export class CommitsActionMenu extends Component<
  CommitsActionMenuProps & DispatchProps,
  CommitsActionMenuState
> {
  readonly state = { isMenuOpen: false };

  render() {
    const { commitsContainerSort } = this.props;
    return (
      <ActionMenu
        style={style(containerStyle)}
        isMenuOpen={this.state.isMenuOpen}
        onMenuToggle={this.onMenuToggle}
      >
        <div style={style('h5Text')}>Sort by</div>
        <RadioMenuItem
          testId="sortTime"
          onClick={() => {
            this.sortCommits(CommitsContainerSorts.TIME);
          }}
          isSelected={commitsContainerSort === CommitsContainerSorts.TIME}
        >
          by time
        </RadioMenuItem>
        <RadioMenuItem
          testId="sortLines"
          onClick={() => {
            this.sortCommits(CommitsContainerSorts.LINES);
          }}
          isSelected={commitsContainerSort === CommitsContainerSorts.LINES}
        >
          by lines changed
        </RadioMenuItem>
      </ActionMenu>
    );
  }

  sortCommits(newCommitsContainerSort: CommitsContainerSorts) {
    this.props.dispatch(setCommitsContainerSort(newCommitsContainerSort));
    this.setState({ isMenuOpen: false });
  }

  onMenuToggle = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };
}

export default connect(getCommitsActionMenuState)(CommitsActionMenu);
