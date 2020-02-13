import * as path from 'path';
import * as vscode from 'vscode';
import { debug } from '../utilities/logger';
import { dispatchMessage } from './dispatchMessage';

let activeTextEditor;
let explorerFile;

process.env.GTDEBUG = '1';

export class WebviewPanel {
  // Only allow a single git-temporal panel to exist at a time
  // for a given instance of vscode.
  // TODO:  The git log data is cached in memory and we could
  //   	allow multiple windows and only start one API server to
  //    serve all of the webview panels for a single instance of
  //    vscode?
  public static currentPanel: WebviewPanel | undefined;
  public static viewType: 'git-temporal';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;

  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string, currentExplorerFile: any) {
    // If we already have a panel, show it.
    activeTextEditor = vscode.window.activeTextEditor;
    explorerFile = currentExplorerFile;

    if (WebviewPanel.currentPanel) {
      WebviewPanel.currentPanel._panel.reveal();
      WebviewPanel.currentPanel.update();
      return;
    }
    // Otherwise, create a new panel.
    debug('createOrShow', { extensionPath, currentExplorerFile });
    const panel = vscode.window.createWebviewPanel(
      WebviewPanel.viewType,
      'Git Temporal',
      vscode.ViewColumn.Active,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `public directory.
        localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'dist'))],
      }
    );

    WebviewPanel.currentPanel = new WebviewPanel(panel, extensionPath);
  }

  public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
    WebviewPanel.currentPanel = new WebviewPanel(panel, extensionPath);
  }

  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    // Set the webview initial html content
    this.update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is
    // closed programmatically
    this._panel.onDidDispose(this.dispose, null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(this.update, null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      this.dispatchMessage,
      null,
      this._disposables
    );
  }

  public dispose = () => {
    debug('disposing WebviewPanel.html');

    WebviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  };

  private dispatchMessage = message => {
    const resp = dispatchMessage(message);
    if (resp) {
      this._panel.webview.postMessage(resp);
    }
  };

  private update = () => {
    if (!this._panel.visible) {
      return;
    }
    debug('updating WebviewPanel.html');
    this._panel.title = 'Git Temporal';
    this._panel.webview.html = this.getHtmlForWebview();
  };

  private getHtmlForWebview() {
    // Local path to index script run in the webview

    // const scriptPathOnDisk = vscode.Uri.file(
    //   path.join(this._extensionPath, 'dist', 'index.js')
    // );
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, 'dist', 'git-temporal-react.vscode.js')
    );

    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const nonce = getNonce();
    const currentPath =
      (explorerFile && explorerFile.fsPath) ||
      activeTextEditor.document.fileName;
    const initialLineNumber = explorerFile
      ? 0
      : activeTextEditor.visibleRanges[0].start.line;

    // const themeName: string | undefined = workspace.getConfiguration("workbench").get("colorTheme")
    debug('webviewPanel currentPath', [
      currentPath,
      explorerFile,
      initialLineNumber,
    ]);
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; connect-src 'unsafe-inline'">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Git Temporal</title>
      </head>
      <body style="padding-top: 20px; padding-right: 20px; overflow: hidden">
        <div
          id="gitTemporal"
          data-current-path="${currentPath}"
          data-initial-line-number="${initialLineNumber}">
          Loading...
        </div>
        <script nonce=${nonce}>
          window.GT_STYLE_VARS = {
            colors: ${JSON.stringify(getColors())},
            margins: ${JSON.stringify(getMargins())}
          }
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getColors() {
  return {
    altBackground: 'var(--vscode-sideBar-background)',
    altForeground: 'var(--vscode-sideBar-foreground)',
    background: 'var(--vscode-editor-background)',
    blobColor: 'var(--vscode-foreground)',
    linkText: 'var(--vscode-editorLink-activeForeground)',
    inputBackground: 'var(--vscode-input-background)',
    inputForeground: 'var(--vscode-input-foreground)',
    text: 'var(--vscode-foreground)',
    z: 'var(--vscode-)',
  };
}

function getMargins() {
  return {
    pageTop: 5,
    pageLeft: 0,
    pageBottom: 10,
    pageRight: 20,
  };
}
