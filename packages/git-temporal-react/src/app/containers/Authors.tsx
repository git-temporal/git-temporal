import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps } from 'app/interfaces';
import { getFilteredStats } from 'app/selectors';
import { style } from 'app/styles';
import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';

interface AuthorsProps {
  minAuthorDate?: number;
  maxAuthorDate?: number;
  authors?: number;
  commits?: number;
  files?: number;
  linesAdded?: number;
  linesDeleted?: number;
}

export class Authors extends Component<AuthorsProps & DispatchProps> {
  render() {
    return (
      <div style={style('panel', 'flexRows')}>
        <span>Authors render here</span>
        <AuthorGravatarImage email="bee.wilkerson@ymail.com" />
        <AuthorGravatarImage email="beewilkerson@invisionapp.com" />
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return getFilteredStats(state);
};

export default connect(mapStateToProps)(Authors);
