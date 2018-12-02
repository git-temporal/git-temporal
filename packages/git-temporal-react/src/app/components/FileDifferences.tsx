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

  render() {
    return (
      <div style={style(outerStyle)}>
        <div style={style(editorStyle)} ref={this.monacoEditorElRef} />
      </div>
    );
  }

  renderMonacoEditor() {
    const el = this.monacoEditorElRef.current;

    const originalModel = editor.createModel(this.props.leftFileContents);
    const modifiedModel = editor.createModel(this.props.rightFileContents);

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
