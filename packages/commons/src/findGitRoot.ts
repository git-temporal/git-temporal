import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const osRoot =
  os.platform() === 'win32' ? process.cwd().split(path.sep)[0] : '/';

export function findGitRoot(startingPath?: string): string | null {
  const parentPath = findInParents(startingPath);
  if (parentPath) {
    return parentPath;
  }
  if (startingPath) {
    // if we didn't find it in the specified root, return git
    // root if in parents of current working directory
    return findInParents(null);
  }
  return null;
}

function findInParents(startingPath?: string): string | null {
  let currentPath =
    (startingPath && path.resolve(startingPath)) || process.cwd();
  try {
    if (!fs.lstatSync(currentPath).isDirectory()) {
      currentPath = path.dirname(currentPath);
    }
  } catch {
    return null; // starting path doesn't exist on disk
  }
  let files;
  do {
    files = fs.readdirSync(currentPath);
    if (files.includes('.git')) {
      break;
    }
    currentPath = path.resolve(currentPath, '..');
  } while (currentPath !== osRoot);

  if (currentPath === osRoot && !files.includes('.git')) {
    return null;
  }
  return currentPath;
}
