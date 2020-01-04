import React from 'react';
import { throttle } from 'lodash';
import { debug } from 'app/utilities/logger';
import { style, getStyleVar } from 'app/styles';
import * as d3 from 'd3';
require('d3-selection-multi');

import { ICommit } from 'app/interfaces';
import { addMoveToFront } from 'app/utilities/d3';
import { dateFromEpochDate } from 'app/utilities/dates';
import { getUTCDateOfCommit, getHourOfCommit } from 'app/utilities/commits';

addMoveToFront(d3);

export interface TimeplotGraphProps {
  // The children are the menu content
  commits: ICommit[];
  startDate: number;
  endDate: number;

  // used for the x scale range
  earliestCommitDate: number;
  latestCommitDate: number;

  // increment or change the value passed to force a rerender of the graph
  // for zoom or resize changes
  forceRender?: number;
  height?: number;
  highlightedCommitIds?: string[];
  style?: string | object;
  onMouseEnter?: (evt, date?) => void;
  onMouseLeave?: (evt, date?) => void;
  onMouseMove?: (evt, date) => void;
  onMouseDown?: (evt, date) => void;
  onMouseUp?: (evt, date) => void;
}

const outerStyle = {
  _extends: 'fill',
  position: 'relative',
  overflow: 'hidden',
};

const blobStyle = {
  fill: '@colors.blobColor',
  opacity: 0.2,
};

const highlightedBlobStyle = {
  fill: '@colors.selected',
  opacity: 0.5,
};

const markerStyle = {
  position: 'absolute',
  height: 130,
  width: 3,
  opacity: 0.5,
  zIndex: 1,
  top: 0,
};

const startDateMarkerStyle = {
  _extends: markerStyle,
  backgroundColor: '@colors.leftRevColor',
};

const endDateMarkerStyle = {
  _extends: markerStyle,
  backgroundColor: '@colors.rightRevColor',
};

const LEFT_PADDING = 20;
const PADDING = 20;

//
// This class is just the timeplot display element.  See ./Timeplot for
// markers, hover popup, zoom and other features
//
export class TimeplotGraph extends React.Component<TimeplotGraphProps> {
  private timeplotGraphRef;

  private svg;
  public xScale;
  public yScale;
  public rScale;
  private updateTimeplotGraphThrottled;

  constructor(props) {
    super(props);
    this.timeplotGraphRef = React.createRef();

    this.renderTimeplotGraph = this.renderTimeplotGraph.bind(this);
    this.updateTimeplotGraphThrottled = throttle(
      this.updateTimeplotGraph,
      1000
    );
  }

  componentDidMount() {
    this.renderTimeplotGraph();
    window && window.addEventListener('resize', this.renderTimeplotGraph);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.forceRender !== this.props.forceRender ||
      prevProps.earliestCommitDate !== this.props.earliestCommitDate ||
      prevProps.latestCommitDate !== this.props.latestCommitDate
    ) {
      this.renderTimeplotGraph();
      this.forceUpdate();
    } else if (prevProps.commits.length !== this.props.commits.length) {
      this.updateTimeplotGraphThrottled();
    } else if (
      prevProps.highlightedCommitIds !== this.props.highlightedCommitIds
    ) {
      this.updateHighlightedCommits();
    }
  }

  componentWillUnmount() {
    window && window.removeEventListener('resize', this.renderTimeplotGraph);
  }

  focus() {
    this.timeplotGraphRef.current.focus();
  }

  render() {
    const { startDate, endDate } = this.props;
    const startDateStyle =
      startDate && this.xScale
        ? { left: this.xScale && this.xScale(dateFromEpochDate(startDate)) }
        : {};
    const endDateStyle =
      endDate && this.xScale
        ? { left: this.xScale(dateFromEpochDate(endDate)) }
        : {};
    return (
      <div
        style={style(outerStyle, this.props.style)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <div style={style('fill')} ref={this.timeplotGraphRef} />
        {startDate ? (
          <div style={style(startDateMarkerStyle, startDateStyle)} />
        ) : null}
        {endDate ? (
          <div style={style(endDateMarkerStyle, endDateStyle)} />
        ) : null}
      </div>
    );
  }

  public getScrollWidth = () => {
    const element = this.timeplotGraphRef.current;
    return element && element.scrollWidth;
  };

  private getHeight(): number {
    return (
      (this.props.height && this.props.height) ||
      this.timeplotGraphRef.current.clientHeight
    );
  }

  public scrollLeft = newScrollLeft => {
    const element = this.timeplotGraphRef.current;
    element.scrollLeft = newScrollLeft;
  };

  private updateHighlightedCommits() {
    const explosionFactor = this.props.highlightedCommitIds.length < 5 ? 25 : 5;
    this.svg
      .selectAll('circle[data-selected="true"]')
      .styles(style(blobStyle))
      .attr('data-selected', false);
    this.svg
      .selectAll(`circle`)
      .filter(d => this.props.highlightedCommitIds.includes(d.id))
      .moveToFront()
      .styles(style(highlightedBlobStyle))
      .attr('data-selected', true)
      .transition()
      .duration(300)
      .attr(
        'r',
        d => this.rScale(d.linesAdded + d.linesDeleted || 0) * explosionFactor
      )
      .transition()
      .duration(800)
      .attr('r', d => this.rScale(d.linesAdded + d.linesDeleted || 0));
  }

  private clearTimeplotGraph() {
    const element = this.timeplotGraphRef.current;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  private renderTimeplotGraph() {
    const element = this.timeplotGraphRef.current;
    this.clearTimeplotGraph();

    // this.$element.width(this.zoom * 100 + '%');
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.clientWidth)
      .attr('height', this.getHeight());
    this.calibrateScales();
    this.renderAxis();

    if (this.props.commits.length <= 0) {
      element.innerHtml =
        "<div class='placeholder'>No commits, nothing to see here.</div>";
      return;
    }

    this.renderBlobs();
    this.updateHighlightedCommits();

    debug(`TimeplotGraph: rendered`);
  }

  private updateTimeplotGraph() {
    this.calibrateScales();
    this.renderBlobs();
    this.updateHighlightedCommits();
  }

  private calibrateScales() {
    const element = this.timeplotGraphRef.current;
    const { earliestCommitDate, latestCommitDate, commits } = this.props;
    const w = element.clientWidth;
    const h = this.getHeight();
    const maxImpact = d3.max(commits.map(d => d.linesAdded + d.linesDeleted));
    const minDate = dateFromEpochDate(earliestCommitDate);
    const maxDate = dateFromEpochDate(latestCommitDate);

    this.xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([LEFT_PADDING, w - PADDING]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, 25])
      .range([10, h - PADDING * 2 - 20]);
    this.rScale = d3
      .scalePow(10)
      .domain([1, maxImpact > 10000 ? 10000 : maxImpact])
      .range([3, 40])
      .clamp(true);
  }

  private renderAxis() {
    const element = this.timeplotGraphRef.current;
    const h = this.getHeight();
    const textColor = getStyleVar('colors', 'text');

    const xAxis = d3
      .axisBottom()
      .scale(this.xScale)
      .ticks(element.scrollWidth / 100);

    const renderedXaxis = this.svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${h - PADDING})`)
      .call(xAxis);
    renderedXaxis.selectAll('path,line').style('stroke', textColor);
    renderedXaxis.selectAll('text').style('fill', textColor);
  }

  private renderBlobs() {
    return this.svg
      .selectAll('circle')
      .data(this.props.commits)
      .enter()
      .append('circle')
      .attr('data-id', d => d.id)
      .attr('cx', d => this.xScale(getUTCDateOfCommit(d)))
      .attr('cy', d => this.yScale(getHourOfCommit(d) + 10))
      .styles(style(blobStyle))
      .transition()
      .duration(1000)
      .attr('r', d => this.rScale(d.linesAdded + d.linesDeleted));
  }

  private getDatesForMouseEvent(evt) {
    const element = this.timeplotGraphRef.current;
    const rect = element.getBoundingClientRect();
    const relativeLeft = evt.clientX - rect.x + element.scrollLeft;
    const exactDate = this.xScale.invert(relativeLeft);
    const startLeft = relativeLeft < 0 ? 0 : relativeLeft;
    const startDate = this.xScale.invert(startLeft);
    const endLeft =
      relativeLeft + 10 > element.width ? element.width : relativeLeft + 10;
    const endDate = this.xScale.invert(endLeft);

    return { exactDate, startDate, endDate, relativeLeft };
  }

  private onMouseEnter = evt => {
    this.props.onMouseEnter && this.props.onMouseEnter(evt);
  };

  private onMouseLeave = evt => {
    this.props.onMouseLeave && this.props.onMouseLeave(evt);
  };

  private onMouseMove = evt => {
    if (!this.props.onMouseMove) {
      return;
    }
    const dates = this.getDatesForMouseEvent(evt);
    this.setState({ hoverMarkerLeft: dates.relativeLeft });
    this.props.onMouseMove(evt, dates);
  };
  private onMouseDown = evt => {
    if (!this.props.onMouseDown) {
      return;
    }
    const dates = this.getDatesForMouseEvent(evt);
    this.props.onMouseDown(evt, dates);
  };

  private onMouseUp = evt => {
    if (!this.props.onMouseUp) {
      return;
    }
    const dates = this.getDatesForMouseEvent(evt);
    this.props.onMouseUp(evt, dates);
  };
}
