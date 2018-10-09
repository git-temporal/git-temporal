import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { DispatchProps, IFilesAndStats } from 'app/interfaces';
import { getFilteredFilesAndStats } from 'app/selectors';
import { style } from 'app/styles';
import { FileCard } from 'app/components/FileCard';

export class Files extends Component<IFilesAndStats & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  readonly outerStyle = style('borderedPanel', {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    maxWidth: 400,
  });

  render() {
    return (
      <div style={this.outerStyle}>
        <AutoSizer>
          {({ height, width }) => (
            // width and height below need minimums for testing
            <List
              width={width || 100}
              height={height || 100}
              rowHeight={70}
              rowRenderer={this.renderRow}
              rowCount={this.props.files.length}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
  renderRow({ index, style, key }) {
    // console.log('render row', row);
    const file = this.props.files[index];
    style.width = 'calc(100% - 20px)';
    return <FileCard key={key} style={style} file={file} />;
  }
}

export const mapStateToProps = state => {
  return getFilteredFilesAndStats(state);
};

export default connect(mapStateToProps)(Files);
