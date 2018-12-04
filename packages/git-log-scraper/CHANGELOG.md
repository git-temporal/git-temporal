## [0.3.0](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/compare/v0.2.0...v0.3.0) - (2018-12-03)

This update includes a refactor of how log data is parsed from the `git log` output.

### Other Commits

- [77144cf](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/commit/77144cf60eb6590b618b4a798817da4a4db1250c) log scraper add more info to the output of the cli script
- [e2565cb](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/commit/e2565cba204ab4269d54cedcd4392c5011328055) git-log-scraper: add build script; fix exception when scraping repo with zero commits
- [1465dcc](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/commit/1465dcc0fe4ff1b8e70a8cb031465fbb806703dc) git-log-scraper: add main and bin for npm package

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [0.2.0 - (2018-10-05)](#020---2018-10-05)
  - [Other Commits](#other-commits)
- [0.1.2 - (2018-09-23)](#012---2018-09-23)
  - [Other Commits](#other-commits-1)
- [0.1.1 - (2018-09-23)](#011---2018-09-23)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## [0.2.0](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/compare/v0.1.8...v0.2.0) - (2018-10-05)

Adds authorEmail to git log data

### Other Commits

- [480ca62](https://github.com/git-temporal/git-temporal/tree/master/packages/git-log-scraper/commit/480ca626a4e3e24ebfa152409d2ac75cd54d59a4) log-scraper: add author e-mail to scraped data

## [0.1.2](https://github.com/git-temporal/git-temporal/compare/v0.1.1...v0.1.2) - (2018-09-23)

### Other Commits

- [81654e7](https://github.com/git-temporal/git-temporal/commit/81654e750a432c815c9221ec60a2b4b7c5e84200) git-log-scraper: fix publish

## [0.1.1](git+https://github.com/git-temporal/git-temporal.git/compare/v0.1.0...v0.1.1) - (2018-09-23)

Initial version matches git-log-utils in features.
It also adds file level information with lines added and deleted to each commit json.
