import { writable } from 'svelte/store';
import type { Vector2, Vector3 } from 'three';

export type Camera2DStore = {
  position2D: Vector2;
  zoom2D: number;
};

export type Camera3DStore = {
  position3D: Vector3;
  zoom3D: number;
};

export type CameraState = Camera2DStore | Camera3DStore | (Camera2DStore & Camera3DStore);

/**
 * Creates a camera store with the provided initial state and update functions.
 * @returns An object containing the store's subscription, initialization, reset, and update functions.
 */
function createCameraStore() {
  const { subscribe, set, update } = writable<CameraState>();

  let defaultState: CameraState;

  /**
   * Initializes the camera store with the provided defaults.
   * @param defaults - The default camera state.
   */
  function init(defaults: CameraState) {
    defaultState = defaults;

    set(defaults);
  }

  /**
   * Resets the camera store to its default state.
   */
  function reset() {
    set(defaultState);
  }

  /**
   * Updates the state of the camera.
   * @param state - The new state to be applied to the camera.
   */
  function updateState(state: CameraState) {
    update((prev) => {
      return { ...prev, ...state };
    });
  }

  /**
   * Updates the partial state of the camera store.
   * @param state - The partial state to be merged with the current state.
   */
  function updatePartialState(state: Partial<CameraState>) {
    update((prev) => {
      return { ...prev, ...state };
    });
  }

  return {
    subscribe,
    init,
    reset,
    update,
    updateState,
    updatePartialState
  };
}

export const cameraStore = createCameraStore();
