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

function createCameraStore() {
  const { subscribe, set, update } = writable<CameraState>();

  let defaultState: CameraState;

  function init(defaults: CameraState) {
    defaultState = defaults;

    set(defaults);
  }

  function reset() {
    set(defaultState);
  }

  function updateState(state: CameraState) {
    update((prev) => {
      return { ...prev, ...state };
    });
  }

  return {
    subscribe,
    init,
    reset,
    update,
    updateState
  };
}

export const cameraStore = createCameraStore();
