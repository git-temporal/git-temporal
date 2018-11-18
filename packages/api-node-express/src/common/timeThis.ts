export function timeThis(callback, ...args) {
  const startTime = Date.now();
  const result = callback.apply(null, args);
  return {
    result,
    time: Date.now() - startTime,
  };
}
