import * as vscode from 'vscode';
import { WebviewPanel } from './WebviewPanel';
import { debug } from '../utilities/logger';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitTemporal.start', explorerFile => {
      debug('got start', explorerFile);
      WebviewPanel.createOrShow(context.extensionPath, explorerFile);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(WebviewPanel.viewType, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        debug(`Got state: ${state}`);
        WebviewPanel.revive(webviewPanel, context.extensionPath);
      },
    });
  }
}
