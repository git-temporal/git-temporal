import React from 'react';
import { style } from 'app/styles';

import { SpinnerImage } from 'app/components/SpinnerImage';
import { request } from 'http';

export interface ExtendingListProps {
  rowCount: number;
  rowRenderer: (index: number, key: number | string) => any;
  style?: object | string;
}

interface ExtendingListState {
  itemsToRender: number;
}

const outerStyle = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const innerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const itemStyle = {
  flexShrink: 0,
};

const PAGE_SIZE = 20;

export class ExtendingList extends React.Component<
  ExtendingListProps,
  ExtendingListState
> {
  readonly state: ExtendingListState = { itemsToRender: PAGE_SIZE };

  private outerContainerRef;
  private innerContainerRef;
  private rowsRendered;
  // componentDidUpdate(newProps) {}

  constructor(props) {
    super(props);
    this.innerContainerRef = React.createRef();
    this.outerContainerRef = React.createRef();

    // this.onScroll = this.onScroll.bind(this);
    // this.debouncedOnScroll = debounce(this.onScroll, 50);
  }
  render() {
    return (
      <div
        style={style(outerStyle, this.props.style)}
        ref={this.outerContainerRef}
        onScroll={this.onScroll}
      >
        <div style={style(innerStyle)} ref={this.innerContainerRef}>
          {this.renderRows()}
        </div>
      </div>
    );
  }

  renderRows(): any {
    this.rowsRendered = 0;
    const rows = [];
    for (
      ;
      this.rowsRendered < this.state.itemsToRender &&
      this.rowsRendered < this.props.rowCount;
      this.rowsRendered++
    ) {
      rows.push(
        <div style={style(itemStyle)}>
          {this.props.rowRenderer(this.rowsRendered, `row${this.rowsRendered}`)}
        </div>
      );
    }
    if (this.rowsRendered < this.props.rowCount) {
      rows.push(
        <div style={{ flexShrink: 0, textAlign: 'center', padding: 10 }}>
          <SpinnerImage height={40} width={40} />
        </div>
      );
    }
    return rows;
  }

  onScroll = () => {
    const innerEl = this.innerContainerRef.current;
    const outerEl = this.outerContainerRef.current;

    if (this.rowsRendered >= this.props.rowCount) {
      return;
    }

    const innerBoundingRect = innerEl.getBoundingClientRect();
    console.log(
      'onScroll',
      innerEl.scrollHeight,
      outerEl.clientHeight,
      outerEl.scrollTop,
      innerBoundingRect.height,
      innerEl.scrollHeight
    );
    if (
      innerEl.scrollHeight > outerEl.clientHeight &&
      outerEl.scrollTop + outerEl.clientHeight > innerEl.scrollHeight - 200
    ) {
      this.setState({
        itemsToRender: this.state.itemsToRender + PAGE_SIZE,
      });
    }
  };
}
