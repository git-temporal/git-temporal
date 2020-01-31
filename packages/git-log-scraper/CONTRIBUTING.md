<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Contributing to git-log-scraper](#contributing-to-git-log-scraper)
  - [Getting started](#getting-started)
  - [Debugging](#debugging)
  - [Tests](#tests)
    - [Exhaustive tests](#exhaustive-tests)
    - [Debugging tests](#debugging-tests)
  - [More Information](#more-information)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contributing to git-log-scraper

Thank you! We welcome your ideas and suggestions via the [git-temporal Github issues](https://github.com/git-temporal/git-temporal/issues) page. And, more importantly, your pull requests!

We strive to build great software and welcome **everyone** to participate.

This project adheres to the [Contributor Covenant 1.2](http://contributor-covenant.org/version/1/2/0). By participating, you are expected to uphold this code. Any issues, discussion posts or code comments not adhering to those guidelines will be removed with notice to the author.

## Getting started

git-log-scraper is part of the git-temporal monorepo created using [Lerna](https://lernajs.io/)

Clone that repo!

```bash
git clone https://github.com/git-temporal/git-temporal.git
cd git-temporal
npx lerna bootstrap
```

Test it out! This will take a while the first time as it needs to pull some large test repos:

```bash
cd packages/git-log-scraper
npm run test
```

## Debugging

You can easily debug the typescript in `src/` directly using:

```bash
npm run debug
```

## Tests

To run the tests:

```bash
npm test
```

To update the snapshots, if for example you changed something that you know will result in a difference, like adding a new attribute to capture:

```bash
npm run test-update-snapshots
```

Testing is fun! No, really, it's not too bad. We use [Jest](https://jestjs.io/docs/en/using-matchers)

#### Exhaustive tests

The tests for for git-log-scraper use a snapshot or last known good strategy against a set of repos. The repositories tested have all been forked and marked read only under the git-temporal organization on GitHub.

Essentially, we a test that several very popular repositories, that have been frozen in time, match every commit minus the `relativeDate` attribute. It takes a really long time.

```
npm run test-exhaustive
```

#### Debugging tests

Add a `debugger` statement in the code where you wish to first pause and then run:

```
npm run test-debug
```

In Chrome, browse to `chrome://inspect/#devices`

## More Information

See `scripts` in `packages/git-log-scraper/package.json` for more development commands.
