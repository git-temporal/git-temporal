let prefix = 'git-temporal';

export function setPrefix(newPrefix: string) {
  prefix = newPrefix;
}

export function error(...args) {
  const [message, ...others] = args;
  writeLog(`${prefix}: ERROR: ${message}`, others);
}

export function log(...args) {
  const [message, ...others] = args;
  writeLog(`${prefix}: info: ${message}`, others);
}

export function debug(...args) {
  // @ts-ignore
  const isDebugOnWindow = typeof window !== 'undefined' && window.GTDEBUG;
  if ((process && process.env.GTDEBUG) || isDebugOnWindow) {
    const [message, ...others] = args;
    writeLog(`${prefix}: debug: ${message}`, others);
  }
}

function writeLog(_message, _others) {
  let [message, others] = [_message, _others];
  // @ts-ignore
  if (others) {
    // VSCode only shows the first arg in the logs :/
    message = `${message} ${JSON.stringify(others, null, 2)}`;
    others = [];
  }
  console.log(message, ...others);
}

export default { setPrefix, error, log, debug };
