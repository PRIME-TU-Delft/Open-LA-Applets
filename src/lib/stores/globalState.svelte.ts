/**
 * The global state store.
 */
class GlobalState {
  /**
   * Represents whether the application is running inside an iframe.
   * @type {boolean}
   */
  inIframe = $state(false);

  /**
   * Represents whether the controls are being interacted with.
   * For example, when the user is moving sliders or dragging draggables.
   * @type {boolean}
   */
  controlsInteractive = $state(false);

  /**
   * Represents whether the application is in fullscreen mode.
   * @type {boolean}
   */
  isFullscreen = $state(false);

  /**
   * Represents whether the application is in inset mode.
   * The application is considered to be in inset mode if it is running inside an iframe or in fullscreen mode.
   * This is a derived state.
   * @type {boolean}
   */
  isInset = $derived(() => !globalState.inIframe || globalState.isFullscreen);

  /**
   * Represents the title of the application.
   * @type {string}
   */
  title = $state('');

  /**
   * Represents the width of the application.
   * @type {number}
   */
  width = $state(0);

  /**
   * Represents the height of the application.
   * @type {number}
   */
  height = $state(0);

  /**
   * Represents when the application should be reset.
   */
  resetKey = $state(Symbol());

  /**
   * Change the state of the global state store.
   * Maraculously, this method works in Svelte 5.
   * @param {Partial<GlobalState>} state - The state to change.
   */
  changeState(state: Partial<GlobalState>) {
    Object.assign(this, state);
  }
}

export const globalState = new GlobalState();
