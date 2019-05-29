import React from 'react';
import { style } from 'app/styles';
import { editor } from 'monaco-editor';

export interface FileDifferencesProps {
  leftFileContents: string;
  rightFileContents: string;
  style?: string | object;
  onFileClick?: (evt, fileName: string) => void;
}

const outerStyle = {
  position: 'relative',
  flexGrow: 1,
  transition: 'all 1s ease',
  overflow: 'scroll',
};

const editorStyle = {
  _extends: 'fill',
  position: 'absolute',
};

export class FileDifferences extends React.Component<FileDifferencesProps> {
  private monacoEditorElRef;

  constructor(props) {
    super(props);
    this.monacoEditorElRef = React.createRef();

    this.renderMonacoEditor = this.renderMonacoEditor.bind(this);
  }

  componentDidMount() {
    this.renderMonacoEditor();
    // window && window.addEventListener('resize', this.renderMonacoEditor);
  }

  componentDidUpdate() {
    this.renderMonacoEditor();
  }

  render() {
    return (
      <div style={style(outerStyle)}>
        <div style={style(editorStyle)} ref={this.monacoEditorElRef} />
      </div>
    );
  }

  renderMonacoEditor() {
    const el = this.monacoEditorElRef.current;
    el.innerHTML = '';

    const leftFileContents =
      (this.props.leftFileContents && atob(this.props.leftFileContents)) || '';
    const rightFileContents =
      (this.props.rightFileContents && atob(this.props.rightFileContents)) ||
      '';

    console.log(`renderMonacoEditor: ${JSON.stringify(this.props, null, 2)}`);
    // console.log(`renderMonacoEditor: atob: ${rightFileContents}`);

    const originalModel = editor.createModel(leftFileContents);
    const modifiedModel = editor.createModel(rightFileContents);

    const diffEditor = editor.createDiffEditor(el);
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    // const navi = editor.createDiffNavigator(diffEditor, {
    //   followsCaret: true, // resets the navigator state when the user selects something in the editor
    //   ignoreCharChanges: true, // jump from line to line
    // });
  }
}
