import React from 'react';
import { style } from 'app/styles';
import * as d3 from 'd3';
require('d3-selection-multi');

import { ICommit } from 'app/interfaces';

export interface TimeplotProps {
  // The children are the menu content
  commits: ICommit[];
  highlightedCommitId?: string;
  style?: string | object;
}

const containerStyle = {
  _extends: 'fill',
};

const blobStyle = {
  fill: '#696969',
  opacity: 0.3,
};

const highlightedBlobStyle = {
  fill: style('selected')['backgroundColor'] || 'blue',
  opacity: 0.8,
};

const LEFT_PADDING = 20;
const PADDING = 20;

export class Timeplot extends React.Component<TimeplotProps> {
  private ref;

  private svg;
  private xScale;
  private yScale;
  private rScale;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.getUTCDateOfCommit = this.getUTCDateOfCommit.bind(this);
    this.getHourOfCommit = this.getHourOfCommit.bind(this);
  }

  componentDidMount() {
    this.renderTimeplot();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.commits.length !== this.props.commits.length) {
      this.renderTimeplot();
      return;
    }
    for (let i = 0; i < 20; i++) {
      if (prevProps.commits[i].id !== this.props.commits[i].id) {
        this.renderTimeplot();
        return;
      }
    }
    if (prevProps.highlightedCommitId !== this.props.highlightedCommitId) {
      this.updateHighlightedCommit();
    }
  }

  render() {
    return (
      <div style={style(containerStyle, this.props.style)} ref={this.ref} />
    );
  }

  private updateHighlightedCommit() {
    this.svg
      .selectAll('circle[data-selected="true"]')
      .styles(style(blobStyle))
      .attr('data-selected', false);
    this.svg
      .selectAll(`circle[data-id="${this.props.highlightedCommitId}"]`)
      .styles(style(highlightedBlobStyle))
      .attr('data-selected', true)
      .transition()
      .duration(500)
      .attr('r', 100)
      .transition()
      .duration(500)
      .attr('r', d => this.rScale(d.linesAdded + d.linesDeleted || 0));
  }

  private clearTimeplot() {
    const element = this.ref.current;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  private renderTimeplot() {
    const element = this.ref.current;
    if (this.props.commits.length <= 0) {
      element.innerHtml =
        "<div class='placeholder'>No commits, nothing to see here.</div>";
      return;
    }
    this.clearTimeplot();

    // this.$element.width(this.zoom * 100 + '%');
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.clientWidth)
      .attr('height', element.clientHeight);
    this.computeScales();
    this.renderAxis(this.svg);
    this.renderBlobs(this.svg);
    this.updateHighlightedCommit();
  }

  private getUTCDateOfCommit(commit) {
    const d = new Date(0);
    d.setUTCSeconds(commit.authorDate);
    return d;
  }

  private getHourOfCommit(commit) {
    const d = this.getUTCDateOfCommit(commit);
    return d.getUTCHours();
  }

  private computeScales() {
    const element = this.ref.current;
    const { commits } = this.props;
    const w = element.clientWidth;
    const h = element.clientHeight;
    const maxImpact = d3.max(commits.map(d => d.linesAdded + d.linesDeleted));
    const minDate = this.getUTCDateOfCommit(commits[commits.length - 1]);
    const maxDate = Date.now();
    const minHour = d3.min(commits.map(this.getHourOfCommit));
    const maxHour = d3.max(commits.map(this.getHourOfCommit));

    this.xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([LEFT_PADDING, w - PADDING]);
    this.yScale = d3
      .scaleLinear()
      .domain([minHour, maxHour])
      .range([10, h - PADDING * 2]);
    this.rScale = d3
      .scaleLinear()
      .domain([0, maxImpact])
      .range([3, 15]);
  }

  private renderAxis(svg) {
    const element = this.ref.current;
    const h = element.clientHeight;

    const xAxis = d3.axisBottom().scale(this.xScale);
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
      .attr('cx', d => this.xScale(this.getUTCDateOfCommit(d)))
      .attr('cy', d => this.yScale(this.getHourOfCommit(d)))
      .styles(style(blobStyle))
      .transition()
      .duration(500)
      .attr('r', d => this.rScale(d.linesAdded + d.linesDeleted || 0));
  }
}