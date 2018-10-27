import React, { Component } from 'react';
import { connect } from 'react-redux';
import { style } from 'app/styles';

import { DispatchProps } from 'app/interfaces';
import { getAuthorsActionMenuState } from 'app/selectors';
import { RadioMenuItem } from 'app/components/RadioMenuItem';
import { ActionMenu } from 'app/components/ActionMenu';

import { setAuthorsContainerSort } from 'app/actions';
import { AuthorsContainerSorts } from 'app/actions/ActionTypes';

interface AuthorsActionMenuProps {
  authorsContainerSort?: AuthorsContainerSorts;
}

const containerStyle = {
  _extends: 'normalText',
  position: 'absolute',
  right: 10,
};

export class AuthorsActionMenu extends Component<
  AuthorsActionMenuProps & DispatchProps
> {
  render() {
    const { authorsContainerSort } = this.props;
    return (
      <ActionMenu style={style(containerStyle)}>
        <div style={style('h5Text')}>Sort by</div>
        <RadioMenuItem
          testId="sortTime"
          onClick={() => {
            this.sortAuthors(AuthorsContainerSorts.TIME);
          }}
          isSelected={authorsContainerSort === AuthorsContainerSorts.TIME}
        >
          by time
        </RadioMenuItem>
        <RadioMenuItem
          testId="sortCommits"
          onClick={() => {
            this.sortAuthors(AuthorsContainerSorts.COMMITS);
          }}
          isSelected={authorsContainerSort === AuthorsContainerSorts.COMMITS}
        >
          by number of commits
        </RadioMenuItem>
        <RadioMenuItem
          testId="sortLines"
          onClick={() => {
            this.sortAuthors(AuthorsContainerSorts.LINES);
          }}
          isSelected={authorsContainerSort === AuthorsContainerSorts.LINES}
        >
          by lines changed
        </RadioMenuItem>
        <div style={style('menuDivider')} />
      </ActionMenu>
    );
  }

  sortAuthors(newAuthorsContainerSort: AuthorsContainerSorts) {
    this.props.dispatch(setAuthorsContainerSort(newAuthorsContainerSort));
  }
}

export default connect(getAuthorsActionMenuState)(AuthorsActionMenu);
