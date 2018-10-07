import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';

import { DispatchProps } from 'app/interfaces';
import { getAuthorsAndCommits } from 'app/selectors';
import { style } from 'app/styles';
import { AuthorGravatarImage } from 'app/components/AuthorGravatarImage';

interface AuthorsProps {
  authors?: object[];
}

export class Authors extends Component<AuthorsProps & DispatchProps> {
  render() {
    return (
      <div style={style('panel', 'flexRows')}>
        <div className="list">
          <List
            width={235}
            height={300}
            rowHeight={90}
            rowRenderer={this.renderRow}
            rowCount={this.props.authors.length}
          />
        </div>
        <span>Authors render here</span>
        <AuthorGravatarImage email="bee.wilkerson@ymail.com" />
        <AuthorGravatarImage email="beewilkerson@invisionapp.com" />
      </div>
    );
  }
  renderRow(author) {
    return <div style={style('panel', 'flexRows')}>{author.authorName}</div>;
  }
}

export const mapStateToProps = state => {
  return { authors: getAuthorsAndCommits(state) };
};

export default connect(mapStateToProps)(Authors);
