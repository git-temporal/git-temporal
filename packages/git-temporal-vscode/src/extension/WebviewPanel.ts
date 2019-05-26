import * as path from 'path';
import * as vscode from 'vscode';

export class WebviewPanel {
  // Only allow a single git-temporal panel to exist at a time
  // for a given instance of vscode.
  // TODO:  The git log data is cached in memory and we could
  //   	allow multiple windows and only start one API server to
  //    serve all of the webview panels for a single instance of
  //    vscode?  The git-temporal api is currently only able to serve up a
  //    single repo, so for each instance of vscode we start a new one.
  public static currentPanel: WebviewPanel | undefined;
  public static viewType: 'git-temporal';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    // If we already have a panel, show it.
    if (WebviewPanel.currentPanel) {
      WebviewPanel.currentPanel._panel.reveal();
      return;
    }
    // Otherwise, create a new panel.
    console.log('git-temporal:createOrShow extensionPath', extensionPath);
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
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          this.update();
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    WebviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private update() {
    this._panel.title = 'Git Temporal';
    this._panel.webview.html = this.getHtmlForWebview();
  }

  private getHtmlForWebview() {
    // Local path to index script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, 'dist', 'index.js')
    );

    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'">          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Git Temporal</title>
      </head>
      <body>
        <div id="gitTemporal">Loading...</div>
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
