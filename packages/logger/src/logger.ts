export function createProxies(prefix: string) {
  return {
    error: (...args: any[]) => proxy(error, prefix, ...args),
    log: (...args: any[]) => proxy(log, prefix, ...args),
    debug: (...args: any[]) => proxy(debug, prefix, ...args),
  };
}

export function error(...args: any[]) {
  proxy(writeLog, 'ERROR', ...args);
}

export function warn(...args: any[]) {
  proxy(writeLog, 'WARN', ...args);
}

export function log(...args: any[]) {
  proxy(writeLog, 'info', ...args);
}

export function debug(...args: any[]) {
  // @ts-ignore
  const isDebugOnWindow = typeof window !== 'undefined' && window.GTDEBUG;
  if ((process && process.env.GTDEBUG) || isDebugOnWindow) {
    proxy(writeLog, 'debug', ...args);
  }
}

const proxy = (fn, prefix, ...args) => {
  const [message, ...others] = args;
  fn(`${prefix}: ${message}`, ...others);
};

function writeLog(_message, ..._others) {
  let [message, others] = [_message, _others];
  const logFn = message.startsWith('ERROR')
    ? console.error
    : message.startsWith('WARN')
      ? console.warn
      : console.log;
  // @ts-ignore
  if (others) {
    // VSCode only shows the first arg in the logs :/
    message = `${message} ${JSON.stringify(others, null, 2)}`;
    others = [];
  }
  logFn(message, ...others);
}

export default { createProxies, error, log, debug };
