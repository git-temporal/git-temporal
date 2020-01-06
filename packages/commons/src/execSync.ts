import child_process, { ExecSyncOptions } from 'child_process';
import { debug } from '@git-temporal/logger';

interface GTExecSyncOptions extends ExecSyncOptions {
  logFn?: (msg: string, ...args: any) => void;
}

export function execSync(cmd: string, options: GTExecSyncOptions = {}): string {
  (options.logFn || debug)(`execSync ${JSON.stringify(options)} \n$ ${cmd}`);
  const cmdOptions: ExecSyncOptions = {
    stdio: 'pipe',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  };
  try {
    return child_process.execSync(cmd, cmdOptions).toString();
  } catch (e) {
    throw new Error(
      `error executing command: ${JSON.stringify({
        cmd,
        options,
        cwd: process.cwd,
        error: (e.stderr && Buffer.from(e.stderr).toString()) || e.toString(),
      })}`
    );
  }
}
