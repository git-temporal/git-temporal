const path = require('path');
const fs = require('fs');

const testRepoBaseDir = path.resolve(__dirname, '../repos');

function isDirectory(source) {
  return fs.lstatSync(path.join(testRepoBaseDir, source)).isDirectory();
}

function getTestRepoDirectories() {
  return fs.readdirSync(testRepoBaseDir).filter(isDirectory);
}

module.exports = {
  testRepoBaseDir,
  snapshotDir: path.resolve(__dirname, '../snapshots'),
  getTestRepoDirectories,
};
