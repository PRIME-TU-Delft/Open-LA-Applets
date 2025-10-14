import { Controls } from '$lib/controls/Controls';
import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Vector2 } from 'three';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

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
        labelNext: get(_)('applets.det_geometric.linearity_two.translate_obda_along_v'),
        labelPrev: get(_)('applets.det_geometric.linearity_two.translate_obda_along_v')
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
        labelNext: get(_)('applets.det_geometric.linearity_two.translate_ogc_along_u'),
        labelPrev: get(_)('applets.det_geometric.linearity_two.translate_aef_along_u')
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
        labelNext: get(_)('applets.det_geometric.linearity_two.rename_oafc_oaeg_cgef'),
        labelPrev: get(_)('applets.det_geometric.linearity_two.rename_oaeg_cgef_oafc')
      };
    },
    (t, state) => {
      state.CGEF.opacity = 1 - t;
      state.OBDA.opacity = 1 - t;

      return {
        state,
        labelNext: get(_)('applets.det_geometric.linearity_two.substract_cgef'),
        labelPrev: get(_)('applets.det_geometric.linearity_two.add_cgef')
      };
    }
  ];
}

export function createControls(u: Vector2, v: Vector2) {
  return Controls.addSlideShow(state, createTranstionStep(u, v));
}
