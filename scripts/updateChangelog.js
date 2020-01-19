#!/usr/bin/env node

const fs = require('fs');
const commons = require('../packages/commons/lib');

const lernaConfig = JSON.parse(fs.readFileSync('lerna.json').toString());

const newVersionText = commons.execSync(
  `npx lerna-changelog --nextVersion=${lernaConfig.version}`
);

const currentChangeLogText = fs.readFileSync('CHANGELOG.md').toString();
const versionTagRegex = new RegExp(
  `(.*)(## ${lernaConfig.version}.*)(<br>## .*)`
);
const matches = currentChangeLogText
  .replace(/\n/g, '<br>')
  .match(versionTagRegex);

let newChangelogText;

if (matches) {
  const preText = matches[1].replace(/<br>/g, '\n');
  const postText = matches[3].replace(/<br>/g, '\n');
  newChangelogText = `#${preText}${newVersionText}\n${postText}`;
} else {
  newChangelogText = `${newVersionText}\n${currentChangeLogText}`;
}

fs.writeFileSync('CHANGELOG.md', newChangelogText);
