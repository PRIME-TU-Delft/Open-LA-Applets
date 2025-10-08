import { Controls } from '$lib/controls/Controls';
import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
import { Vector4 } from 'three';

const state = [new Vector4(2, -1, -1, 2), new Vector4(1, 2, 4, 4), new Vector4(4, -2, -4, 6)];
type S = typeof state;

const transitionSteps: SlideShowSteps<S> = [
  (_t, state) => {
    // STEP 1
    const temp = state[1].clone(); // R2

    // R2 = R1
    state[1] = state[0].clone();

    // R1 = R2
    state[0] = temp;

    return {
      state,
      labelNext: 'R1 ⇔ R2',
      labelPrev: { en: 'Original state', nl: 'Oorspronkelijke staat' }
    };
  },
  (t, state) => {
    // STEP 2
    // R2 = R2 - 2*R1
    state[1] = state[1].sub(state[0].clone().multiplyScalar(2 * t));

    return {
      state,
      labelNext: 'R2 = R2 - 2*R1',
      labelPrev: 'R2 = R2 + 2*R1'
    };
  },
  (t, state) => {
    // R3 = R3 - 4*R1
    state[2] = state[2].sub(state[0].clone().multiplyScalar(4 * t));

    return { state, labelNext: 'R3 = R3 - 4*R1', labelPrev: 'R3 = R3 + 4*R1' };
  },
  (t, state) => {
    // STEP 3
    // R3 = -1/10*R3
    state[2] = state[2].sub(state[2].clone().multiplyScalar(1.1 * t));

    return { state, labelNext: 'R3 = -1/10*R3', labelPrev: 'R3 = -10*R3' };
  },
  (_t, state) => {
    // STEP 4
    const temp = state[2].clone(); // R3

    // R3 = R2
    state[2] = state[1].clone();

    // R2 = R3
    state[1] = temp;

    return { state, labelNext: 'R2 ⇔ R3', labelPrev: 'R2 ⇔ R3' };
  },
  (t, state) => {
    // STEP 5
    // R1 = R1 - 2*R2
    state[0] = state[0].sub(state[1].clone().multiplyScalar(2 * t));

    return {
      state,
      labelNext: 'R1 = R1 - 2*R2',
      labelPrev: 'R1 = R1 + 2*R2'
    };
  },
  (t, state) => {
    // R3 = R3 + 5*R2
    state[2] = state[2].add(state[1].clone().multiplyScalar(5 * t));

    return { state, labelNext: 'R3 = R3 + 5*R2', labelPrev: 'R3 = R3 - 5*R2' };
  },
  (t, state) => {
    // STEP 6
    // R2 = R2 - 2 * R3
    state[1] = state[1].sub(state[2].clone().multiplyScalar(2 * t));

    return { state, labelNext: 'R2 = R2 - 2*R3', labelPrev: 'R2 = R2 + 2*R3' };
  }
];

export const controls = Controls.addSlideShow(state, transitionSteps);
