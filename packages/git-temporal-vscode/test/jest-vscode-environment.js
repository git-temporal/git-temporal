// sourced from https://github.com/rozzzly/vscode-prompt-debug/tree/master/test

/**
 * Exposes the Visual Studio Code extension API to the Jest testing environment.
 *
 * Tests would otherwise not have access because they are sandboxed.
 *
 * @see https://github.com/Unibeautify/vscode/blob/61897cd6cd0567db2c8688c3c0b835f9b5c5b446/test/jest-vscode-environment.ts
 */

import * as vscode from 'vscode';

const NodeEnvironment = require('jest-environment-node');

class VsCodeEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.vscode = vscode;
  }

  async teardown() {
    this.global.vscode = {};
    return super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = VsCodeEnvironment;
