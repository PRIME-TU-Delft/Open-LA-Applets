import { writable } from 'svelte/store';

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

export const globalStateStore = createGlobalStateStore();
