import child_process from 'child_process';
import { escapeForCli } from './escapeForCli';

export function isGitIgnored(path) {
  try {
    return (
      child_process
        .execSync(`git check-ignore ${escapeForCli(path)}`, {
          stdio: 'pipe',
        })
        .toString()
        .trim() !== ''
    );
  } catch (e) {
    return false;
  }
}
