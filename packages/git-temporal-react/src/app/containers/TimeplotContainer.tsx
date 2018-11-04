import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, ITimeplotContainerState } from 'app/interfaces';
import { getTimeplotContainerState } from 'app/selectors';

import { Timeplot } from 'app/components/Timeplot';
import { style } from 'app/styles';

const statsStyle = {
  _extends: 'normalText',
  width: '100%',
  textAlign: 'center',
};

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
      <div style={style(this.outerStyle)}>
        <Timeplot
          commits={this.props.commits}
          highlightedCommitId={this.props.highlightedCommitId}
          onMouseEnter={this.onTimeplotMouseEvent}
          onMouseLeave={this.onTimeplotMouseEvent}
          onMouseMove={this.onTimeplotMouseEvent}
          onMouseDown={this.onTimeplotMouseEvent}
          onMouseUp={this.onTimeplotMouseEvent}
        />
        <div style={style(statsStyle)}>
          {this.props.commits.length} commits by {this.props.authors} authors
        </div>
      </div>
    );
  }
  onTimeplotMouseEvent = (_evt, dates) => {
    console.log('onTimeplotMouseEvent', dates);
  };
}

export default connect(getTimeplotContainerState)(TimeplotContainer);
