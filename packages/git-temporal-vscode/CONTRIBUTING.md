<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Contributing to git-temporal](#contributing-to-git-temporal)
  - [Getting started](#getting-started)
  - [Debugging](#debugging)
  - [See Also](#see-also)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contributing to git-temporal

Thank you! We welcome your ideas and suggestions via the [git-temporal Github issues](https://github.com/git-temporal/git-temporal/issues) page. And, more importantly, your pull requests!

We strive to build great software and welcome **everyone** to participate.

This project adheres to the [Contributor Covenant 1.2](http://contributor-covenant.org/version/1/2/0). By participating, you are expected to uphold this code. Any issues, discussion posts or code comments not adhering to those guidelines will be removed with notice to the author.

## Getting started

Clone git-temporal repo and setup monorepo:

```
git clone git@github.com:git-temporal/git-temporal.git
cd git-temporal
npm install
npx lerna bootstrap
```

In a new terminal tab, build react component for vscode:

```
cd packages/git-temporal-react
npm run build
```

In a new terminal tab, build the vscode webview plugin and open vscode:

```
cd packages/git-temporal/vscode
npm run build
code .
```

In VSCode,

- start a development server by pressing F5
- switch to development window
- open a recent project from the VSCode `File` menu
- select a file in the project
- From the command palette (⇧⌘P) type `git-temporal` and press enter

As of right now there is no hot update capability when working on the vscode extension. Most of the UI lives in packages/git-temporal-react and you'll want to follow the instructions in the root CONTRIBUTING.md to run a hot server there for doing changes.

For a faster dev workflow,

- run once `npm run build-watch` in packages/git-temporal-react

and then when you want to see your changes in vscode,

- run `npm run build` in packages/git-temporal-vscode
- reload VSCode development window (control+option+command+L)
- close and reopen git-temporal in vscode (shift+command+P git-temporal)

## Debugging

As of this writing, debugging web view extensions in VSCode is painful. You can open a chromium dev tools on the VSCode development window (option+command+I), but I have not found a way to inspect the underlying DOM :(

You will want to do most of your changes using the react hot server in packages/git-temporal-react.

## See Also

- [Quick tutorial on developing extension](https://code.visualstudio.com/api/get-started/your-first-extension)
