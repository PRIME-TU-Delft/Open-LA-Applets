import { Controls } from '$lib/controls/Controls';
import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Vector2 } from 'three';

// Animation
const state = {
  polygonLabel: 'OABC',
  polygonColorAdd: PrimeColor.darkGreen,
  polygonColorSub: PrimeColor.raspberry,
  offset: new Vector2(0, 0),
  showCBDE: true
};
type S = typeof state;

function createTranstionStep(u: Vector2): SlideShowSteps<S> {
  return [
    (t, state) => {
      const offset = u.clone().multiplyScalar(-t);

      state.offset = offset;

      if (t > 0.5) {
        state.polygonLabel = 'OADE';
        state.polygonColorAdd = PrimeColor.blue;
        state.polygonColorSub = PrimeColor.blue;
        state.showCBDE = false;
      } else {
        state.polygonLabel = 'OABC';
        state.polygonColorAdd = PrimeColor.darkGreen;
        state.polygonColorSub = PrimeColor.raspberry;
        state.showCBDE = true;
      }

      return {
        state,
        labelNext: 'Translate ABD',
        labelPrev: 'Translate ABD'
      };
    }
  ];
}

export function createControls(u: Vector2) {
  return Controls.addSlideShow(state, createTranstionStep(u));
}
