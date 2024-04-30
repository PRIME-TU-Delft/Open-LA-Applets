import { derived, writable } from 'svelte/store';

type GlobalState = {
  inIframe: boolean;
  isActive: boolean;
  controlsInteractive: boolean;
  isFullscreen: boolean;
  title: string;
};

function createGlobalStateStore() {
  const { subscribe, set, update } = writable({
    inIframe: false,
    isActive: false,
    controlsInteractive: false,
    isFullscreen: false,
    title: ''
  });

  function changeState(state: Partial<GlobalState>) {
    update((prev) => {
      return { ...prev, ...state };
    });
  }

  return {
    subscribe,
    set,
    changeState
  };
}

/**
 * The global state store.
 */
export const globalStateStore = createGlobalStateStore();

/**
 * Determines if the component is inset.
 *
 * @remarks
 * This function is derived from the `globalStateStore` and returns `true` if the component is not in an iframe or if it is in fullscreen mode.
 *
 * @param $globalState - The global state object.
 * @returns A boolean value indicating if the component is inset.
 */
export const isInset = derived(globalStateStore, ($globalState) => {
  return !$globalState.inIframe || $globalState.isFullscreen;
});
