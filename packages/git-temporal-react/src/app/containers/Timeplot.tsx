import React from 'react';
import { connect } from 'react-redux';
import { delay } from 'lodash';
import { debug } from '@git-temporal/logger';

import { style } from 'app/styles';
import { ITimeplotState, ICommit, DispatchProps } from 'app/interfaces';

import { getTimeplotContainerState } from 'app/selectors';
import { setDates } from 'app/actions/setDates';
import { selectSingleCommit } from 'app/actions/commits';

import { debounce } from 'app/utilities/debounce';
import { throttle } from 'app/utilities/throttle';
import { ZoomContainer, ICustomZoom } from 'app/components/ZoomContainer';
import { TimeplotGraph } from 'app/components/TimeplotGraph';
import { EpochSpan } from 'app/components/EpochSpan';
import { CommaNumber } from 'app/components/CommaNumber';

import {
  TimeplotPopup,
  TIMEPLOT_POPUP_WIDTH,
} from 'app/components/TimeplotPopup';

import { filterCommitsForSpan } from 'app/utilities/commits';

interface TimeplotLocalState {
  hoverMarkerLeft: number;
  scrollLeft: number;
  popupOpen: boolean;
  timeplotRenders: number;
  popupCommits: ICommit[];
  popupStartDate?: Date;
  popupEndDate?: Date;
  customZooms: ICustomZoom[];
  mouseInPopover: boolean;
  zoom: number;
}

const initialState = {
  // TODO: this should be a constant. I think it's used elsewhere?
  hoverMarkerLeft: -40, // -40 = out of sight
  scrollLeft: 0,
  popupOpen: false,
  timeplotRenders: 0,
  popupCommits: [],
  popupStartDate: null,
  popupEndDate: null,
  zoom: 100,
  customZooms: [],
  mouseInPopover: false,
};

const outerStyle = {
  overflow: 'visible', // needed for popup
  flex: '0 0 200px',
};

const graphContainerStyle = {
  _extends: ['borderedPanel', 'flexColumn'],
  flexGrow: 0,
  flexShrink: 0,
  position: 'relative',
  marginTop: 10,
  minHeight: 100,
};

const statsStyle = {
  _extends: 'normalText',
  width: '100%',
  textAlign: 'center',
};

const timeplotStyle = {
  _extends: 'fill',
};

const markerStyle = {
  position: 'absolute',
  height: 130,
  width: 10,
  opacity: 0.5,
  zIndex: 1,
  top: 0,
};

const hoverMarkerStyle = {
  _extends: markerStyle,
  backgroundColor: '@colors.selectable',
};

export class Timeplot extends React.Component<
  ITimeplotState & DispatchProps,
  TimeplotLocalState
> {
  readonly state: TimeplotLocalState = initialState;
  private timeplotRef: any;
  private outerRef: any;
  private debouncedOnMouseLeave: (args: any) => void;
  private debouncedOnMouseMove: (args: any) => void;

  // we don't want to necessarily rerender on changes to these
  private lastMouseMoveCoords: { pageX: number; pageY: number };
  private lastMouseDownDate: Date;
  private lastRerenderRequestedAt: Date;

  constructor(props) {
    super(props);
    this.lastRerenderRequestedAt = Date.now() as any;
    this.timeplotRef = React.createRef();
    this.outerRef = React.createRef();
    this.debouncedOnMouseLeave = debounce(this.onMouseLeave, 100);
    this.debouncedOnMouseMove = throttle(this.onMouseMove, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.timeplotRef.current) {
      return;
    }
    this.timeplotRef.current.focus();
    if (
      prevProps.startDate !== this.props.startDate ||
      prevProps.endDate !== this.props.endDate
    ) {
      this.addCustomZooms();
    }
    if (this.lastRerenderRequestedAt < this.props.rerenderRequestedAt) {
      debug('forcing timeplot rerender');
      this.lastRerenderRequestedAt = this.props.rerenderRequestedAt;
      this.setState({ timeplotRenders: this.state.timeplotRenders + 1 });
    }
    if (prevState.zoom !== this.state.zoom) {
      this.scrollToStartDate();
    }
  }

  render() {
    const { commits = [], startDate, endDate } = this.props;
    if (!commits || commits.length === 0) {
      return null;
    }
    const outerLeft =
      (this.outerRef.current &&
        this.outerRef.current.getBoundingClientRect().x) ||
      0;
    const popupLeft =
      this.state.hoverMarkerLeft - this.state.scrollLeft <
      TIMEPLOT_POPUP_WIDTH + 20
        ? this.state.hoverMarkerLeft - this.state.scrollLeft + outerLeft - 10
        : this.state.hoverMarkerLeft -
          this.state.scrollLeft -
          TIMEPLOT_POPUP_WIDTH +
          outerLeft;

    const firstCommitTime = commits[commits.length - 1].authorDate;
    const lastCommitTime = commits[0].authorDate;

    return (
      <div style={style(outerStyle)} ref={this.outerRef}>
        <div style={style(graphContainerStyle)}>
          <ZoomContainer
            onZoom={this.onZoom}
            onMouseLeave={this.debouncedOnMouseLeave}
            onScroll={this.onScroll}
            customZooms={this.state.customZooms}
            scrollLeft={this.state.scrollLeft}
          >
            <TimeplotGraph
              forceRender={this.state.timeplotRenders}
              commits={this.props.commits}
              style={style(timeplotStyle)}
              ref={this.timeplotRef}
              highlightedCommitIds={this.props.highlightedCommitIds}
              startDate={startDate}
              endDate={endDate}
              onMouseMove={this.debouncedOnMouseMove}
              onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp}
            />
            <div
              style={style(hoverMarkerStyle, {
                left: this.state.hoverMarkerLeft,
              })}
              onMouseMove={this.onMouseHoverMarker}
              onMouseEnter={this.onMouseHoverMarker}
            />
          </ZoomContainer>

          <div style={style(statsStyle)}>
            Total of <CommaNumber value={this.props.commits.length} /> commits
            by <CommaNumber value={this.props.authors} /> authors spanning{' '}
            <EpochSpan
              firstEpochTime={firstCommitTime}
              secondEpochTime={lastCommitTime}
            />
          </div>
        </div>
        <TimeplotPopup
          commits={this.state.popupCommits}
          isOpen={this.state.popupOpen}
          startDate={this.state.popupStartDate}
          endDate={this.state.popupEndDate}
          left={popupLeft}
          onClose={this.onPopupClose}
          onCommitSelected={this.onCommitSelected}
          onMouseEnter={this.onMouseEnterPopup}
          onMouseLeave={this.onMouseLeavePopup}
        />
      </div>
    );
  }

  private onPopupClose = () => {
    this.setState({ popupOpen: false });
  };

  private onScroll = scrollLeft => {
    this.setState({ scrollLeft });
  };

  private onZoom = newZoom => {
    this.setState({
      timeplotRenders: this.state.timeplotRenders + 1,
      zoom: newZoom,
    });
  };

  private onMouseEnterPopup = evt => {
    this.setState({ mouseInPopover: true });
  };

  private onMouseLeavePopup = evt => {
    this.setState({ mouseInPopover: false, popupOpen: false });
  };

  private onMouseLeave = _evt => {
    delay(() => {
      if (!this.state.mouseInPopover) {
        this.setState({ popupOpen: false });
      }
    }, 250);
  };

  private onMouseMove = (evt, { startDate, endDate, relativeLeft }) => {
    const popupCommits = filterCommitsForSpan(
      this.props.commits,
      startDate,
      endDate
    );
    const { pageX, pageY } = evt;
    // this enables greater agility, if the users vertical movement is
    // greater than their horizontal, they might be headed to the popup
    if (!this.lastMouseMoveCoords || pageY >= this.lastMouseMoveCoords.pageY) {
      this.setState({
        popupCommits,
        popupOpen: true,
        popupStartDate: startDate,
        popupEndDate: endDate,
        // +3 : the marker needs to not get in the way of clicking the graph underneath
        //    otherwise you end up clicking on the marker itself
        hoverMarkerLeft: relativeLeft + 3,
      });
    }
    this.lastMouseMoveCoords = { pageX, pageY };
  };

  private onMouseDown = (evt, { startDate }) => {
    debug('Timeplot: onMouseDown', evt.shiftKey, startDate);
    evt.preventDefault();
    this.lastMouseDownDate = startDate;
    this.setDates(startDate, null);
  };

  private onMouseUp = (evt, { startDate }) => {
    debug(
      'Timeplot: onMouseUp',
      evt.shiftKey,
      startDate,
      this.lastMouseDownDate
    );
    evt.preventDefault();
    if (!this.lastMouseDownDate) {
      return;
    }
    if (startDate !== this.lastMouseDownDate) {
      this.setDates(startDate, this.lastMouseDownDate);
    } else {
      this.setDates(startDate, null);
    }
    this.lastMouseDownDate = null;
  };

  private onMouseHoverMarker = evt => {
    this.setState({
      hoverMarkerLeft:
        this.state.hoverMarkerLeft + (evt.pageX - evt.clientX) + 3,
    });
  };

  private onCommitSelected = (evt, commit, single) => {
    evt.stopPropagation();
    const { dispatch, commits } = this.props;
    console.log('onCommitSelected', evt, commit, single, this.props.startDate);
    if (single) {
      dispatch(selectSingleCommit(commit, commits));
    } else {
      const epochAuthorDate = commit.authorDate * 1000;
      this.setDates(epochAuthorDate, null);
    }
  };

  private setDates(startDate, endDate) {
    const { dispatch } = this.props;
    dispatch(setDates(startDate, endDate));
  }

  private scrollToStartDate() {
    const { startDate } = this.props;

    if (this.state.zoom <= 100) {
      this.setState({ scrollLeft: 0 });
    } else if (startDate && this.timeplotRef.current) {
      const { xScale } = this.timeplotRef.current;
      this.setState({ scrollLeft: xScale(startDate * 1000) - 30 });
    }
  }

  private addCustomZooms() {
    const { startDate, endDate } = this.props;
    if (!startDate || !this.timeplotRef.current) {
      this.setState({ customZooms: [] });
      return;
    }
    const { xScale, getScrollWidth } = this.timeplotRef.current;
    const defaultedEndDate = endDate ? endDate * 1000 : new Date();
    const spanLeft = xScale(startDate * 1000);
    const spanRight = xScale(defaultedEndDate);
    const span = spanRight - spanLeft + 15;
    if (span <= 0) {
      this.setState({ customZooms: [] });
      return;
    }
    const scrollWidth = getScrollWidth();
    this.setState({
      customZooms: [
        {
          value: Math.floor((scrollWidth / span) * 100),
          label: 'Zoom to selected time span',
        },
      ],
    });
  }
}

export default connect(getTimeplotContainerState)(Timeplot);
