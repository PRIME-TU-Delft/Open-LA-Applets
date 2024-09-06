export type Side = 'none' | 'left' | 'right' | 'center';

/**
 * Store for enabling/disabling confetti
 */
class ConfettiState {
  side = $state<Side>('none');
  private timeOut: number | undefined = $state(undefined);

  setState(side: Side, coolDown: number) {
    console.log(this.timeOut);
    if (this.timeOut) return;
    this.side = side;

    this.timeOut = setTimeout(() => {
      this.side = 'none';
      console.log('clearing timeout');
      clearTimeout(this.timeOut);
      this.timeOut = undefined;
    }, coolDown);
  }

  /**
   * Enable confetti on the left side
   */
  left(coolDown = 5000) {
    this.setState('left', coolDown);
  }

  /**
   * Enable confetti on the right side
   */
  right(coolDown = 5000) {
    this.setState('right', coolDown);
  }

  /**
   * Enable confetti on center side
   */
  center(coolDown = 5000) {
    this.setState('center', coolDown);
  }

  /**
   * Disable confetti
   */
  none() {
    this.side = 'none';
    clearTimeout(this.timeOut);
  }
}

export const confettiState = new ConfettiState();
