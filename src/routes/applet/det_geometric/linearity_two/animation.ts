import { Controls } from '$lib/controls/Controls';
import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Vector2 } from 'three';

// Animation
const state = {
  OAFC: {
    visible: true
  },
  OAFCG: {
    visible: false
  },
  OGC: {
    visible: false,
    offset: new Vector2(0, 0)
  },
  CGEF: {
    visible: false,
    opacity: 1
  },
  OAEG: {
    visible: false,
    color: PrimeColor.darkGreen
  },
  OBDA: {
    offset: new Vector2(0, 0),
    opacity: 1
  },
  vPlusW: {
    visible: false
  }
};

function createTranstionStep(u: Vector2, v: Vector2): SlideShowSteps<typeof state> {
  return [
    (t, state) => {
      state.OAFC.visible = true;
      state.OBDA.offset = v.clone().multiplyScalar(t);
      state.vPlusW.visible = false;

      return {
        state,
        labelNext: { en: 'Translate OBDA along v', nl: 'Verschuif OBDA langs v' },
        labelPrev: { en: 'Translate OBDA along v', nl: 'Verschuif OBDA langs v' }
      };
    },
    (t, state) => {
      state.vPlusW.visible = true;

      // Replace OAFC with OAFCG & OGC
      state.OAFC.visible = false;
      state.OAFCG.visible = true;
      state.OGC.visible = true;

      // Translate OGC along u
      state.OGC.offset = u.clone().multiplyScalar(t);

      return {
        state,
        labelNext: { en: 'Translate OGC along u', nl: 'Verschuif OGC langs u' },
        labelPrev: { en: 'Translate AEF along u', nl: 'Verschuif AEF langs u' }
      };
    },
    (_t, state) => {
      // Replace OAFCG & OGC with CGEF & OAEG
      state.OAFCG.visible = false;
      state.OGC.visible = false;

      state.CGEF.visible = true;
      state.OAEG.visible = true;

      return {
        state,
        labelNext: { en: 'Rename OAFC = OAEG + CGEF', nl: 'Hernoem OAFC = OAEG + CGEF' },
        labelPrev: { en: 'Rename OAEG + CGEF = OAFC', nl: 'Hernoem OAEG + CGEF = OAFC' }
      };
    },
    (t, state) => {
      state.CGEF.opacity = 1 - t;
      state.OBDA.opacity = 1 - t;

      return {
        state,
        labelNext: { en: 'Substract CGEF ', nl: 'Trek CGEF af' },
        labelPrev: { en: 'Add CGEF', nl: 'Tel CGEF op' }
      };
    }
  ];
}

export function createControls(u: Vector2, v: Vector2) {
  return Controls.addSlideShow(state, createTranstionStep(u, v));
}
