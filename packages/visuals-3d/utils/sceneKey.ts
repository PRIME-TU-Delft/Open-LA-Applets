import type { Scene } from 'three';

export const sceneKey = Symbol();

export type SceneContext = {
  scene: Scene;
};
