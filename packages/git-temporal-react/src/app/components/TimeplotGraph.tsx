import React from 'react';
import { style } from 'app/styles';
import * as d3 from 'd3';
require('d3-selection-multi');

import { ICommit } from 'app/interfaces';
import { addMoveToFront } from 'app/utilities/d3';
import { dateFromEpochDate } from 'app/utilities/dates';
import {
  getUTCDateOfCommit,
  getHourOfCommit,
  first20CommitsEqual,
} from 'app/utilities/commits';

addMoveToFront(d3);

export interface TimeplotGraphProps {
  // The children are the menu content
  commits: ICommit[];
  startDate: number;
  endDate: number;
  // increment or change the value passed to force a rerender of the graph
  // for zoom or resize changes
  forceRender?: number;
  highlightedCommitId?: string;
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
};

const blobStyle = {
  fill: '#696969',
  opacity: 0.3,
};

const highlightedBlobStyle = {
  fill: '@colors.selected',
  opacity: 0.8,
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

  constructor(props) {
    super(props);
    this.timeplotGraphRef = React.createRef();

    this.renderTimeplotGraph = this.renderTimeplotGraph.bind(this);
  }

  componentDidMount() {
    this.renderTimeplotGraph();
    window && window.addEventListener('resize', this.renderTimeplotGraph);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.commits.length !== this.props.commits.length ||
      prevProps.forceRender !== this.props.forceRender ||
      !first20CommitsEqual(prevProps.commits, this.props.commits)
    ) {
      console.log('commits updated for forceRender');
      this.renderTimeplotGraph();
      this.forceUpdate();
    }
    if (prevProps.highlightedCommitId !== this.props.highlightedCommitId) {
      this.updateHighlightedCommit();
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
        {startDate && (
          <div style={style(startDateMarkerStyle, startDateStyle)} />
        )}
        {endDate && <div style={style(endDateMarkerStyle, endDateStyle)} />}
      </div>
    );
  }

  public getScrollWidth = () => {
    const element = this.timeplotGraphRef.current;
    return element && element.scrollWidth;
  };

  public scrollLeft = newScrollLeft => {
    const element = this.timeplotGraphRef.current;
    element.scrollLeft = newScrollLeft;
  };

  private updateHighlightedCommit() {
    this.svg
      .selectAll('circle[data-selected="true"]')
      .styles(style(blobStyle))
      .attr('data-selected', false);
    this.svg
      .selectAll(`circle[data-id="${this.props.highlightedCommitId}"]`)
      .moveToFront()
      .styles(style(highlightedBlobStyle))
      .attr('data-selected', true)
      .transition()
      .duration(500)
      .attr('r', 100)
      .transition()
      .duration(500)
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
    if (this.props.commits.length <= 0) {
      element.innerHtml =
        "<div class='placeholder'>No commits, nothing to see here.</div>";
      return;
    }
    this.clearTimeplotGraph();

    // this.$element.width(this.zoom * 100 + '%');
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.clientWidth)
      .attr('height', element.clientHeight);
    this.calibrateScales();
    this.renderAxis(this.svg);
    this.renderBlobs(this.svg);
    this.updateHighlightedCommit();
  }

  private calibrateScales() {
    const element = this.timeplotGraphRef.current;
    const { commits } = this.props;
    const w = element.clientWidth;
    const h = element.clientHeight;
    const maxImpact = d3.max(commits.map(d => d.linesAdded + d.linesDeleted));
    const minDate = getUTCDateOfCommit(commits[commits.length - 1]);
    const maxDate = getUTCDateOfCommit(commits[0]); // Date.now();

    // console.log(
    //   'dates',
    //   minDate,
    //   maxDate,
    //   commits[0].authorDate,
    //   getHourOfCommit(commits[0])
    // );

    this.xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([LEFT_PADDING, w - PADDING]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, 25])
      .range([10, h - PADDING * 2]);
    this.rScale = d3
      .scalePow(10)
      .domain([1, maxImpact > 10000 ? 10000 : maxImpact])
      .range([3, 30])
      .clamp(true);
  }

  private renderAxis(svg) {
    const element = this.timeplotGraphRef.current;
    const h = element.clientHeight;

    const xAxis = d3
      .axisBottom()
      .scale(this.xScale)
      .ticks(element.scrollWidth / 100);
    const yAxis = d3
      .axisLeft()
      .scale(this.yScale)
      .ticks(0);

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${h - PADDING})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${LEFT_PADDING - PADDING}, 0)`)
      .call(yAxis);
  }

  private renderBlobs(svg) {
    const { commits } = this.props;
    return svg
      .selectAll('circle')
      .data(commits)
      .enter()
      .append('circle')
      .attr('data-id', d => d.id)
      .attr('cx', d => this.xScale(getUTCDateOfCommit(d)))
      .attr('cy', d => this.yScale(getHourOfCommit(d)))
      .styles(style(blobStyle))
      .transition()
      .duration(500)
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
