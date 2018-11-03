import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, ITimeplotContainerState } from 'app/interfaces';
import { getTimeplotContainerState } from 'app/selectors';

import { Timeplot } from 'app/components/Timeplot';

export class TimeplotContainer extends Component<
  ITimeplotContainerState & DispatchProps
> {
  constructor(props) {
    super(props);
  }

  readonly outerStyle = {
    _extends: ['borderedPanel', 'flexColumns'],
    flexGrow: 0,
    position: 'relative',
    marginTop: 10,
    minHeight: 100,
  };

  render() {
    return (
      <Timeplot
        commits={this.props.commits}
        highlightedCommitId={this.props.highlightedCommitId}
      />
    );
  }
}

export default connect(getTimeplotContainerState)(TimeplotContainer);
