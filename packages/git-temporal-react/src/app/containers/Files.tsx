import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer } from 'react-virtualized';

import { selectPath } from 'app/actions';
import { DispatchProps, IFilesContainerState } from 'app/interfaces';
import { getFilesContainerState } from 'app/selectors';
import { style } from 'app/styles';
import { FileCard } from 'app/components/FileCard';
import FilesActionMenu from './FilesActionMenu';

export class Files extends Component<IFilesContainerState & DispatchProps> {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillUnmount() {
    console.log('git-temporal-react: unmounting Files');
  }

  readonly outerStyle = {
    _extends: ['borderedPanel', 'flexColumns'],
    flexGrow: 1,
    position: 'relative',
    maxWidth: 400,
    minWidth: 400,
  };

  readonly headerStyle = {
    _extends: ['h2Text'],
    display: 'block',
    flexGrow: 0,
    position: 'relative',
    marginRight: 30,
  };

  render() {
    const sortTitle = this.props.filesContainerSort;
    return (
      <div style={style(this.outerStyle)}>
        <FilesActionMenu />
        <div style={style(this.headerStyle)}>
          <span data-testId="header">Files by {sortTitle}</span>
        </div>
        <div style={{ flexGrow: 1 }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={
                  width || 100 // width and height below need minimums for testing
                }
                height={height || 100}
                rowHeight={60}
                rowRenderer={this.renderRow}
                rowCount={this.props.files.length}
                filesContainerSort={this.props.filesContainerSort}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  renderRow({ index, style, key }) {
    // console.log('render row', row);
    const file = this.props.files[index];
    style.width = 'calc(100% - 20px)';
    return (
      <FileCard
        key={key}
        style={style}
        file={file}
        onFileClick={this.onFileClick}
      />
    );
  }

  onFileClick = (event, fileName) => {
    event.stopPropagation();
    this.props.dispatch(selectPath(fileName));
  };
}

export const mapStateToProps = state => {
  return getFilesContainerState(state);
};

export default connect(mapStateToProps)(Files);
