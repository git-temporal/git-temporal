// https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44

export function debounce(fn, delay): (args: any) => any {
  let timerId;
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}
