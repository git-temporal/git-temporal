import { ExtensionContext } from 'vscode';
import { activate } from './index';

describe('Extension', () => {
  test('Activate', () => {
    const context: ExtensionContext = {
      subscriptions: [],
    } as any;
    activate(context);
    expect(context.subscriptions.length).toBeGreaterThan(0);
  });
});
