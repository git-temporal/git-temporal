import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DispatchProps, IDifferenceViewerContainerState } from 'app/interfaces';
import { getDifferenceViewerContainerState } from 'app/selectors';
import { style } from 'app/styles';

export class DifferenceViewer extends Component<
  IDifferenceViewerContainerState & DispatchProps
> {
  constructor(props) {
    super(props);
  }

  readonly outerStyle = {
    _extends: ['borderedPanel', 'flexColumns'],
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    minWidth: '90%',
    maxWidth: 320,
  };

  render() {
    return (
      <div style={style(this.outerStyle)}>
        <img
          style={{ width: '100%', height: '100%' }}
          src="Freehand_-_diff_viewer.png"
        />
      </div>
    );
  }
}

export default connect(getDifferenceViewerContainerState)(DifferenceViewer);
