import React from 'react';
import { defer, debounce } from 'lodash';
import { style, getStyleVar } from 'app/styles';
import { editor } from 'monaco-editor';
import { debug } from 'app/utilities/logger';

export interface FileDifferencesProps {
  selectedPath: string;
  initialLineNumber?: number;
  rerenderRequestedAt: Date;
  leftFileContents: string;
  rightFileContents: string;
  style?: string | object;
  onFileClick?: (evt, fileName: string) => void;
}

const outerStyle = {
  position: 'relative',
  flexGrow: 1,
  overflow: 'hidden',
};

const editorStyle = {
  _extends: 'fill',
  position: 'absolute',
};

export class FileDifferences extends React.Component<FileDifferencesProps> {
  private monacoEditorElRef = React.createRef<HTMLDivElement>();
  // private navigator: any;
  private scrollTop: number = 0;
  private gotoLine: number | null = null;
  private debouncedHandleScroll: any;

  constructor(props: FileDifferencesProps) {
    super(props);
    this.renderMonacoEditor = this.renderMonacoEditor.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.debouncedHandleScroll = debounce(this.handleScroll, 400);
  }

  componentDidMount() {
    this.scrollTop = 0;
    this.gotoLine = this.props.initialLineNumber;
    this.renderMonacoEditor();
    window && window.addEventListener('resize', this.renderMonacoEditor);
  }

  componentDidUpdate(prevProps) {
    defer(() => this.renderMonacoEditor());
    if (prevProps.selectedPath !== this.props.selectedPath) {
      this.scrollTop = 0;
    }
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
    if (!el) {
      return null;
    }
    el.innerHTML = '';

    const leftFileContents =
      (this.props.leftFileContents && atob(this.props.leftFileContents)) || '';
    const rightFileContents =
      (this.props.rightFileContents && atob(this.props.rightFileContents)) ||
      '';

    debug(
      `renderMonacoEditor: el ${el.offsetHeight} ${el.clientHeight} ${
        el.offsetWidth
      } ${el.clientWidth}`
    );
    const originalModel = editor.createModel(leftFileContents);
    const modifiedModel = editor.createModel(rightFileContents);

    // @ts-ignore
    editor.defineTheme('myTheme', this.getTheme());
    editor.setTheme('myTheme');

    const diffEditor = editor.createDiffEditor(el, {
      readOnly: true,
    });
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    // this.navigator = editor.createDiffNavigator(diffEditor, {
    //   // resets the navigator state when the user selects something in the editor
    //   // if true the diff editor will jump to the first diff when a new file is
    //   // selected.
    //   followsCaret: false,
    //   ignoreCharChanges: true, // jump from line to line
    // });

    const innerEditor = diffEditor.getOriginalEditor();
    if (this.gotoLine) {
      debug('FileDifferences got gotoLine', this.gotoLine);
      // deferred so that the handle scroll fires and setScrollTop is
      // called with the scrollTop position for the requested line number
      defer(() => {
        // revealLines() causes the gotoLine to be at the top
        diffEditor.revealLines(this.gotoLine, 999999);
        this.gotoLine = null;
      });
    } else {
      innerEditor.setScrollTop(this.scrollTop);
    }
    innerEditor.onDidScrollChange(this.handleScroll);
  }

  handleScroll(evt: any) {
    this.scrollTop = evt.scrollTop;
  }

  getTheme() {
    const background = this.getColorValue('background');
    const foreground = this.getColorValue('text');
    const theme = {
      base: 'vs',
      inherit: true,
      rules: [{ background, foreground }],
      colors: {
        'editor.foreground': foreground,
        'editor.background': background, // don't show selection
        'editorCursor.foreground': background,
      },
    };
    // 'editor.lineHighlightBackground': '#0000FF20',
    // 'editorLineNumber.foreground': '#008800',
    // 'editor.selectionBackground': '#88000030',
    // 'editor.inactiveSelectionBackground': '#88000015',
    debug('FileDifferences.getTheme() returning ', theme);
    return theme;
  }

  getColorValue(ourName: string): string {
    const valueIn = getStyleVar('colors', ourName);

    // interpolate css variable values to real color value for monaco
    const matches = valueIn.match(/var\(([^\)]*)/);
    if (matches) {
      const varName = matches[1];
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        varName
      );
      return value;
    }
    return valueIn;
  }
}
