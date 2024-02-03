/**
 * Wait for a certain amount of time before executing a function more than once. This makes searching more efficient.
 * @param cb Callback function that is delayed by the specified time
 * @param delay delay time in milliseconds
 * @returns Generic S
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends any[], S>(cb: (...args: T[]) => S, delay = 250) {
  let timeout: NodeJS.Timeout;

  return (...args: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function throttle<T, A extends Array<T>>(callback: (...args: A) => void, delay = 250) {
  let shouldWait = false;

  return (...args: A) => {
    if (shouldWait) return;

    callback(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}
