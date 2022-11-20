// @Deprecated this shouldn't be nessesairy with threlte

import type { Scene } from 'three';

export const sceneKey = Symbol();

export type SceneContext = {
  scene: Scene;
};
