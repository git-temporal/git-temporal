<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Contributing to git-temporal](#contributing-to-git-temporal)
  - [Getting started](#getting-started)
    - [Start the API service](#start-the-api-service)
    - [Start the React hot server](#start-the-react-hot-server)
    - [Run the development version of VSCode plugin](#run-the-development-version-of-vscode-plugin)
  - [Updating External Dependencies](#updating-external-dependencies)
  - [publishing everything](#publishing-everything)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contributing to git-temporal

Thank you! We welcome your ideas and suggestions via the [git-temporal Github issues](https://github.com/git-temporal/git-temporal/issues) page. And, more importantly, your pull requests!

We strive to build great software and welcome **everyone** to participate.

This project adheres to the [Contributor Covenant 1.2](http://contributor-covenant.org/version/1/2/0). By participating, you are expected to uphold this code. Any issues, discussion posts or code comments not adhering to those guidelines will be removed with notice to the author.

## Getting started

Clone this repo:

```
git clone git@github.com:git-temporal/git-temporal.git
```

Install dependencies:

```
npm install
```

This monorepo uses Lerna.

Bootstrapping links packages together in the tree so that you can make changes to multiple packages at a time and see the effect of all those without publishing to npm! From monorepo root:

```
npx lerna bootstrap
```

Build everything (from the monorepo root):

```
npm run build
```

See [lerna docs](https://github.com/lerna/lerna/blob/master/README.md) for more monorepo power user badassness.

### Start the API service

In a new terminal window, start the api:

```
cd packages/api-node-express
GT_GIT_REPO_PATH=/Users/Bee/projects/rangy npm run start
```

Replace the GT_GIT_REPO_PATH value above with a path to a local repository on your computer. Without the added env var above, it would start an API server serving the current branch of this repository's data. Not that interesting.

### Start the React hot server

In a new terminal window, start the hot dev server for the React component that is the UI for all editors and web:

```
cd packages/git-temporal-react
npm run start
```

That's pretty much it. If everything went as expected you should be looking at a web browser with the git-temporal UI for the repository.

### Run the development version of VSCode plugin

See packages/git-temporal-vscode/CONTRIBUTING.md

## Updating External Dependencies

To update any of the packages used by any of the git-temporal packages, check out [Lerna Update Wizard](https://github.com/Anifacted/lerna-update-wizard/blob/master/README.md). From the git-temporal mono repo root:

```
npx lernaupdate
```

## publishing everything

Run lerna publish. It might give errors that can be ignored.

```
lerna publish
```

Check the diff to make sure it updated versions in all the package.json files:

```
git diff
```

Commit version changes

```
git commit -am 'version bump'
```

Update change log

```
npm run changelog
```

View diff (adjust CHANGELOG.md manually if needed):

```
git diff
```

Commit changelog

```
git commit -am 'update changelog`
```

Tag version (use new version number below):

```
git tag v0.0.0
```

Push changes and tags

```
git push origin master
git push origin master --tags
```

Publish NPM packages and VSCode extension:

```
npm run publish
npm run publish:vscode
```

You might get an error(s) during publishing of vscode about npm versions not found for our packages. NPM sometimes lags behind. Wait a couple of minutes and try publishing just the vscode extension again:

```
npm run publish:vscode
```
