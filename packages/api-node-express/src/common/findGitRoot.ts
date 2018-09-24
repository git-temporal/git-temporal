import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const osRoot =
  os.platform() === 'win32' ? process.cwd().split(path.sep)[0] : '/';

export default function findGitRoot(startingPath?: string): string | null {
  let currentPath =
    (startingPath && path.resolve(startingPath)) || process.cwd();
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
