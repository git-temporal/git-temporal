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
lerna bootstrap
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

The tests for for git-log-scraper use a snapshot or last known good strategy against a set of repos. The repositories tested have all been forked and marked read only under the git-temporal organization on GitHub.

Essentially, we a test that several very popular repositories, that have been frozen in time, match every commit minus the `relativeDate` attribute.

To run the tests:

```bash
npm test
```

To update the snapshots, if for example you changed something that you know will result in a difference, like adding a new attribute to capture:

```bash
npm run test-update-snapshots
```

Testing is fun! No, really, it's not too bad. We use Mocha + Chai + a few chai addons to make the job easy. Here are some pertinent links:

[Mocha.js test framework](http://visionmedia.github.io/mocha)
_for `describe, it, before, after`_

[Chai Assertion Library](http://chaijs.com)
_for `should, expect, assert`. Note we are using the BDD style_

#### Debugging tests

Add a `debugger` statement in the code where you wish to first pause and then run:

```
npm run test-debug
```

In Chrome, browse to `chrome://inspect/#devices` and look for a "Target" like `...mocha/bin/_mocha file:///...`. Click the inspect link beneath the Target.

The Chrome debugger should come up and you should be paused in `_mocha`. Click the "resume" button or press F8 in the debugger and your next stop should be the debugger statement you added in the test.

Don't forget to remove the `debugger` statement you added. The linter will not allow any changes to be committed with stray `debugger` statements.

## More Information

See `scripts` in `packages/git-log-scraper/package.json` for more development commands.

```

```
