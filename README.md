<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Git Temporal](#git-temporal)
  - [Download latest vscode beta preview](#download-latest-vscode-beta-preview)
  - [Running the developer environment](#running-the-developer-environment)
- [Updates](#updates)
  - [January 9, 2020](#january-9-2020)
  - [January 5, 2020](#january-5-2020)
  - [June 10, 2019](#june-10-2019)
  - [May 29, 2019](#may-29-2019)
  - [May 11, 2019](#may-11-2019)
  - [_Coming Soon to a Code Editor / Electron Desktop Near You!_](#_coming-soon-to-a-code-editor--electron-desktop-near-you_)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Git Temporal

## Download latest vscode beta preview

https://www.icloud.com/iclouddrive/0aX-NVXLRy-TPHQ5qJ1I7bspw#git-temporal-vscode-0.4

Use "Extensions: Install from VSIX..." from vscode command pallette to install.

## Running the developer environment

See [CONTRIBUTING.md](https://github.com/git-temporal/git-temporal/blob/master/CONTRIBUTING.md) for instructions on running the development
version of git-temporal.

# Updates

## January 9, 2020

Directory differences and deleted files work!

Also working on getting the repository in order and setting up the PR process and pipeline. Hopeful that lerna-changelog will be able to help manage the change log :fingerscrossed:

## January 5, 2020

Greetings fellow time travelers and happy new year! I have some exciting news to share, but first, check out this sick icon.

<p align="center">
  <img src="https://raw.githubusercontent.com/git-temporal/git-temporal/master/packages/git-temporal-vscode/images/gticon.png" alt="GitTemporal Logo" />
</p>

But wait, there's more. I am narrowing in on a near future date for the release of the the VSCode version of git-time-machine, er, I mean git-temporal. :) I Should have named it Git Tempo; too late?

Check out this dandy demo:

<p align="center">
  <img src="https://raw.githubusercontent.com/git-temporal/git-temporal/master/packages/git-temporal-vscode/images/gtdemo.gif" alt="GitTemporal Demo" />
</p>

And... for a limited time only, you can play with it yourself or.... :)

- download the .vsix file:
  https://www.icloud.com/iclouddrive/0UH58xw-bu8Vvo9yNLx7PCY9Q#git-temporal-vscode-0.1

- in vscode command pallette (command+shift+p), type `vsix`
- select "Extensions: Install from VSIX..."
- locate and select downloaded file from open dialog

This is an early beta. There are still some known issues that I'm working through and I promise I will publish to VSCode Marketplace before January is concluded.

Known issues:

- directory differencing isn't really working on Windows. Results don't match Mac.
- can't diff deleted files (Windows & Mac)
- can't diff renamed files (Windows & Mac)
- need to webpack bundle vscode extension

...but all and all, it is at least as useful as it's predecessor.

Enjoy, and have a new year filled with joy, -bee

## June 10, 2019

We have a new look!

[<img alt="New side panel design" src="docs/20190610_git-temporal-react.png"
/>]

And it almost all works in VSCode!

[<img alt="New side panel design" src="docs/20190610_git-temporal-vscode.png"
/>]

I've also been busy bringing the version of react up to 16.8 and react-redux to 7.1.0-alpha4 and beginning refactoring of the redux containers to functional components using hooks

## May 29, 2019

We have git-temporal running in VSCode!!

This was one that I kept saying to myself would never work, but it almost all did. The only casulty was the List component from react-virtualized used for rendering the commits list. Unfortunately, the rv CellMeasurer which is needed by the commits list because the cards are not fixed height, refused to work in a vscode webview. I replaced it with a too simple ExtendingList component. Everything else, including embedding a monaco difference viewer inside a vscode webview (that'll never work) and D3 (that'll never work) worked!

[<img alt="Git Temporal running in vsCode" src="docs/git-temporal-live-in-vscode.png"
/>]

It looks like ass, but it works. The design needs rethinking. Here's what I'm thinking:

1. The difference viewer should be the primary display component.
1. Fold the search, stats, authors, files and commits into collapsible side panel with a two tier tree like thing like:

```text
    <search/>

    + Stats
      Created: 2 years ago
      Active Time Span: 11 months
      Last Commit:  1 year ago

    + Authors (23)          by time
      <image/> Peter Gibbons (2 minutes ago)
               (44 commits)
      <image/> Bill Lumberg (5 days ago)
               (2 commits)
      ... show more

    + Commits (12,456)      by time
      <tiny commit card>
      <tiny commit card>
      <tiny commit card>
      ... show more

    + Files (78)            by time
      <tiny file card>
      <tiny file card>
      <tiny file card>
      ... show more
```

## May 11, 2019

Demo of alpha POC (git-temnporal-react package) running in the React / Webpack hot server.
https://git-temporal.github.io/git-temporal/docs/design/git-temporal-teaser.mp4

## _Coming Soon to a Code Editor / Electron Desktop Near You!_

[<img alt="Git Temporal art boards in InVision Studio" src="docs/design/UI_Moc_InVision_Studio.png"
/>](https://www.invisionapp.com/studio)

```

```
