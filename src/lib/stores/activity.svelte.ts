/**
 * Store for enabling/disabling scroll lock
 */
class ActivityState {
  isActive = $state(false);
  private timeOut: number | undefined = undefined;

  /**
   * Disable orbitcontroller after ms and call fn
   * @param ms milliseconds to wait before disabling
   * @param fn fuction to call after ms
   */
  disableAfterAnd(ms: number, fn?: () => void) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      fn?.();
      this.isActive = false;
    }, ms);
  }

  /**
   * Enable orbitcontroller and clear any current timeouts
   */
  enable() {
    if (this.isActive) return;

    clearInterval(this.timeOut);
    this.isActive = true; // Set activity to true
  }

  /**
   * Same as disableAfterAnd but without a function
   * @param ms milliseconds to wait before disabling
   */
  disableAfter(ms: number) {
    this.disableAfterAnd(ms); // Disable and do nothing
  }

  /**
   * Remove all timeouts
   */
  removeTimeout() {
    // Remove the timeout
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }

  /**
   * Reset orbitcontoller to false
   * @returns true if activity is true
   */
  reset() {
    this.isActive = false; // Reset activity to false
  }
}

export const activityState = new ActivityState();
