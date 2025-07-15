export type Side = 'un-set' | 'left' | 'right' | 'center';

/**
 * Store for enabling/disabling confetti
 */
class ConfettiState {
  confettiSide = $state('un-set');
  updateState = $state(Math.random());

  /**
   * Enable confetti on the left side
   */
  left() {
    this.updateState = Math.random();

    this.confettiSide = 'left';
  }

  /**
   * Enable confetti on the right side
   */
  rightSide() {
    this.updateState += Math.random();
    this.confettiSide = 'right';
  }

  /**
   * Enable confetti on center side
   */
  center() {
    this.updateState = Math.random();

    this.confettiSide = 'center';
  }

  /**
   * Disable confetti
   */
  none() {
    this.confettiSide = 'un-set';
  }
}

export const confettiState = new ConfettiState();
