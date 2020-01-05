import child_process, { ExecSyncOptions } from 'child_process';
import { debug } from '@git-temporal/logger';

interface GTExecSyncOptions extends ExecSyncOptions {
  logFn?: (msg: string, ...args: any) => void;
}

export function execSync(cmd: string, options: GTExecSyncOptions = {}): string {
  (options.logFn || debug)(`$ ${cmd}`);
  const cmdOptions: ExecSyncOptions = {
    stdio: 'pipe',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  };
  return child_process.execSync(cmd, cmdOptions).toString();
}
