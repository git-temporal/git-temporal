#!/usr/bin/env node

const fs = require('fs');
const commons = require('../packages/commons/lib');

const lernaConfig = JSON.parse(fs.readFileSync('lerna.json').toString());

const newVersionText = commons.execSync(
  `npx lerna-changelog --nextVersion=${lernaConfig.version}`
);

const currentChangeLogText = fs.readFileSync('CHANGELOG.md').toString();
const versionTagRegex = new RegExp(`(.*)(## v${lernaConfig.version}.*)?(##.*)`);
const matches = currentChangeLogText
  .replace(/\n/g, '<br>')
  .match(versionTagRegex);

const preText = matches[1].replace(/<br>/g, '\n');
const matchText = matches[2];
const postText = matches[3].replace(/<br>/g, '\n');

const newChangelogText = matchText
  ? `${preText}${newVersionText}\n${postText}`
  : `${newVersionText}\n${preText}${postText}`;

fs.writeFileSync('CHANGELOG.md', newChangelogText);
