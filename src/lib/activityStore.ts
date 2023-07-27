import { writable } from 'svelte/store';

/**
 * Store for enabling/disabling orbitcontroller
 */
function createActivityStore() {
  const { subscribe, set } = writable(false);

  let timeOut: NodeJS.Timeout;

  return {
    subscribe,

    /**
     * Enable orbitcontroller and clear any current timeouts
     */
    enable: () => {
      clearInterval(timeOut);
      set(true); // Set activity to true
    },

    /**
     * Disable orbitcontroller after ms and call fn
     * @param ms milliseconds to wait before disabling
     * @param fn fuction to call after ms
     */
    disableAfterAnd: (ms: number, fn: () => void) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        fn();
        set(false);
      }, ms);
    },

    /**
     * Same as disableAfterAnd but without a function
     * @param ms milliseconds to wait before disabling
     */
    disableAfter: (ms: number) => {
      activityStore.disableAfterAnd(ms, () => {}); // Disable and do nothing
    },

    /**
     * Remove all timeouts
     */
    removeTimeOut: () => {
      // Remove the timeout
      if (timeOut) {
        clearTimeout(timeOut);
      }
    },

    /**
     * Reset orbitcontoller to false
     * @returns true if activity is true
     */
    reset: () => {
      requestAnimationFrame(() => {
        set(false); // Reset activity to false
      });
    }
  };
}

export const activityStore = createActivityStore();
