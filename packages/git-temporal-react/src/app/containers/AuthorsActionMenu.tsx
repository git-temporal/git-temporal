import React, { Component } from 'react';
import { connect } from 'react-redux';
import { style } from 'app/styles';

import { DispatchProps } from 'app/interfaces';
import { getAuthorsActionMenuState } from 'app/selectors';
import { MenuItem } from 'app/components/MenuItem';
import { RadioMenuItem } from 'app/components/RadioMenuItem';
import { ActionMenu } from 'app/components/ActionMenu';

import {
  setAuthorsContainerSort,
  setAuthorsContainerFilter,
  removeAllAuthorFilters,
} from 'app/actions';
import {
  AuthorsContainerSorts,
  AuthorsContainerFilters,
} from 'app/actions/ActionTypes';

interface AuthorsActionMenuProps {
  authorsContainerFilter?: AuthorsContainerFilters;
  authorsContainerSort?: AuthorsContainerSorts;
  filteredAuthors?: string[];
}

const containerStyle = {
  _extends: 'normalText',
  position: 'absolute',
  right: 10,
};

export class AuthorsActionMenu extends Component<
  AuthorsActionMenuProps & DispatchProps
> {
  componentDidMount() {
    this.viewAllIfNoFilteredAuthors();
  }
  componentDidUpdate() {
    this.viewAllIfNoFilteredAuthors();
  }

  render() {
    const {
      filteredAuthors,
      authorsContainerFilter,
      authorsContainerSort,
    } = this.props;
    const notFiltered = !filteredAuthors || filteredAuthors.length === 0;
    return (
      <ActionMenu style={style(containerStyle)}>
        <div style={style('h5Text')}>View</div>

        <RadioMenuItem
          testId="allAuthors"
          onClick={() => {
            this.filterAuthors(AuthorsContainerFilters.ALL);
          }}
          isSelected={authorsContainerFilter === AuthorsContainerFilters.ALL}
        >
          All Authors
        </RadioMenuItem>
        <RadioMenuItem
          testId="filteredAuthors"
          onClick={() => {
            this.filterAuthors(AuthorsContainerFilters.FILTERED);
          }}
          isSelected={
            authorsContainerFilter === AuthorsContainerFilters.FILTERED
          }
          disabled={notFiltered}
        >
          Filtered Authors
        </RadioMenuItem>

        <div style={style('h5Text')}>Sort</div>

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
        <MenuItem
          testId="removeAllAuthorFilters"
          onClick={() => this.removeAllAuthorFilters()}
          disabled={notFiltered}
        >
          Remove All Author Filters
        </MenuItem>
      </ActionMenu>
    );
  }

  filterAuthors(newAuthorsContainerFilter: AuthorsContainerFilters) {
    this.props.dispatch(setAuthorsContainerFilter(newAuthorsContainerFilter));
  }

  sortAuthors(newAuthorsContainerSort: AuthorsContainerSorts) {
    this.props.dispatch(setAuthorsContainerSort(newAuthorsContainerSort));
  }

  removeAllAuthorFilters() {
    this.props.dispatch(removeAllAuthorFilters());
  }

  viewAllIfNoFilteredAuthors() {
    const { authorsContainerFilter, filteredAuthors } = this.props;
    if (
      authorsContainerFilter !== AuthorsContainerFilters.ALL &&
      (!filteredAuthors || filteredAuthors.length === 0)
    ) {
      this.filterAuthors(AuthorsContainerFilters.ALL);
    }
  }
}

export default connect(getAuthorsActionMenuState)(AuthorsActionMenu);
