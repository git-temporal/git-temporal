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
import { SpinnerContainer } from 'app/components/SpinnerContainer';

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

const GRAPH_HEIGHT = 120;

const outerStyle = {
  overflow: 'visible', // needed for popup
  flex: `0 0 ${GRAPH_HEIGHT}px`,
};

const graphContainerStyle = {
  _extends: ['altPanel', 'flexColumn'],
  flex: `0 0 ${GRAPH_HEIGHT}px`,
  minHeight: `${GRAPH_HEIGHT}px`,
  position: 'relative',
  marginTop: 5,
  overflow: 'hidden',
};

const statsStyle = {
  _extends: 'normalText',
  width: '100%',
  textAlign: 'center',
  paddingTop: '@margins.small+px',
  paddingBottom: '@margins.small+px',
  position: 'absolute',
  top: '@margins.medium+px',
  textShadow: '2px 2px @colors.background',
};

const statsTextStyle = {
  opacity: 0.8,
  backgroundColor: '@colors.background',
};

const zoomStyle = {
  position: 'absolute',
  top: '@margins.small+px',
  zIndex: 1,
};

const timeplotStyle = {
  _extends: 'fill',
  background: '@colors.background',
  color: '@colors.text',
};

const markerStyle = {
  position: 'absolute',
  height: GRAPH_HEIGHT,
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
    const {
      commits = [],
      isFetching,
      startDate,
      endDate,
      earliestCommitDate,
      latestCommitDate,
      highlightedCommitIds,
    } = this.props;

    const outerLeft =
      (this.outerRef.current &&
        this.outerRef.current.getBoundingClientRect().x) ||
      0;
    const popupLeft =
      // WARNING must manually test changes to this in
      // vsCode plugin - the popup is in a slightly
      // shifted position from the web
      this.state.hoverMarkerLeft - this.state.scrollLeft <
      TIMEPLOT_POPUP_WIDTH + 20
        ? // when popup is opening right of hover marker:
          this.state.hoverMarkerLeft - this.state.scrollLeft + outerLeft - 20
        : // when popup is opening to the left of the hover:
          this.state.hoverMarkerLeft -
          this.state.scrollLeft -
          TIMEPLOT_POPUP_WIDTH +
          outerLeft +
          20;

    return (
      <div style={style(outerStyle)} ref={this.outerRef}>
        <div style={style(graphContainerStyle)}>
          <SpinnerContainer
            isSpinning={!commits || commits.length === 0}
            spinnerImageSize={75}
          >
            <ZoomContainer
              onZoom={this.onZoom}
              onMouseLeave={this.debouncedOnMouseLeave}
              onScroll={this.onScroll}
              customZooms={this.state.customZooms}
              scrollLeft={this.state.scrollLeft}
              style={style(zoomStyle)}
            >
              <TimeplotGraph
                forceRender={this.state.timeplotRenders}
                commits={this.props.commits}
                style={style(timeplotStyle)}
                ref={this.timeplotRef}
                height={GRAPH_HEIGHT}
                highlightedCommitIds={highlightedCommitIds}
                startDate={startDate}
                endDate={endDate}
                earliestCommitDate={earliestCommitDate}
                latestCommitDate={latestCommitDate}
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
              <span style={style(statsTextStyle)}>
                {!isFetching ? 'Total of ' : 'Counting... '}
                <CommaNumber value={this.props.commits.length} /> commits by{' '}
                <CommaNumber value={this.props.authors} /> authors spanning{' '}
                <EpochSpan
                  firstEpochTime={earliestCommitDate}
                  secondEpochTime={latestCommitDate}
                />
              </span>
            </div>
          </SpinnerContainer>
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
