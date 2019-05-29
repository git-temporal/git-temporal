let prefix = 'GitTemporal';

export function setPrefix(newPrefix: string) {
  prefix = newPrefix;
}

export function error(...args) {
  const [message, ...others] = args;
  console.log(`${prefix}: ERROR: ${message}`, ...others);
}

export function log(...args) {
  const [message, ...others] = args;
  console.log(`${prefix}: info: ${message}`, ...others);
}

export function debug(...args) {
  // @ts-ignore
  const isDebugOnWindow = typeof window !== 'undefined' && window.GTDEBUG;
  if ((process && process.env.GTDEBUG) || isDebugOnWindow) {
    const [message, ...others] = args;
    console.log(`${prefix}: debug: ${message}`, ...others);
  }
}

export default { setPrefix, error, log, debug };
