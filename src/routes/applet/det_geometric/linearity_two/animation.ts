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

      return { state, labelNext: 'Translate OBDA along v', labelPrev: 'Translate OBDA along v' };
    },
    (t, state) => {
      state.vPlusW.visible = true;

      // Replace OAFC with OAFCG & OGC
      state.OAFC.visible = false;
      state.OAFCG.visible = true;
      state.OGC.visible = true;

      // Translate OGC along u
      state.OGC.offset = u.clone().multiplyScalar(t);

      return { state, labelNext: 'Translate OGC along u', labelPrev: 'Translate AEF along u' };
    },
    (_t, state) => {
      // Replace OAFCG & OGC with CGEF & OAEG
      state.OAFCG.visible = false;
      state.OGC.visible = false;

      state.CGEF.visible = true;
      state.OAEG.visible = true;

      return {
        state,
        labelNext: 'Rename OAFC = OAEG + CGEF',
        labelPrev: 'Rename OAEG + CGEF = OAFC'
      };
    },
    (t, state) => {
      state.CGEF.opacity = 1 - t;
      state.OBDA.opacity = 1 - t;

      return { state, labelNext: 'Substract CGEF ', labelPrev: 'Add CGEF' };
    }
  ];
}

export function createControls(u: Vector2, v: Vector2) {
  return Controls.addSlideShow(state, createTranstionStep(u, v));
}
