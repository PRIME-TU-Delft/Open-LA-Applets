import { Controls } from '$lib/controls/Controls';
import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
import { Vector4 } from 'three';

const state = [new Vector4(2, -1, -1, 2), new Vector4(1, 2, 4, 4), new Vector4(4, -2, -4, 6)];
type S = typeof state;

const transitionSteps: SlideShowSteps<S> = [
  (t, state) => {
    // R2 = 2*R2
    state[1] = state[1].add(state[1].clone().multiplyScalar(t));

    return {
      state,
      labelNext: 'R2 = 2*R2',
      labelPrev: { en: 'Original state', nl: 'Oorspronkelijke staat' }
    };
  },
  (t, state) => {
    // R2 = R2 - R1
    state[1] = state[1].sub(state[0].clone().multiplyScalar(t));

    return {
      state,
      labelNext: 'R2 = R2 - R1',
      labelPrev: 'R2 = R2 + R1'
    };
  },
  (t, state) => {
    // R3 = R3 - 2*R1
    state[2] = state[2].sub(state[0].clone().multiplyScalar(2 * t));

    return {
      state,
      labelNext: 'R3 = R3 - 2*R1',
      labelPrev: 'R3 = R3 + 2*R1'
    };
  },
  (t, state) => {
    // R3 = -0.5*R3
    state[2] = state[2].sub(state[2].clone().multiplyScalar(1.5 * t));

    return { state, labelNext: 'R3 = -0.5*R3', labelPrev: 'R3 = -2*R3' };
  },
  (t, state) => {
    // R1 = R1 + R3
    state[0] = state[0].add(state[2].clone().multiplyScalar(t));

    return {
      state,
      labelNext: 'R1 = R1 + R3',
      labelPrev: 'R1 = R1 - R3'
    };
  },
  (t, state) => {
    // R2 = R2  -9*R3
    state[1] = state[1].sub(state[2].clone().multiplyScalar(9 * t));

    return { state, labelNext: 'R2 = R2 - 9*R3', labelPrev: 'R2 = R2 + 9*R3' };
  },
  (t, state) => {
    // R2 = 0.2*R2
    state[1] = state[1].sub(state[1].clone().multiplyScalar(0.8 * t));

    return { state, labelNext: 'R2 = 0.2*R2', labelPrev: 'R2 = 5*R2' };
  },
  (t, state) => {
    // R1 = R1 + R2
    state[0] = state[0].add(state[1].clone().multiplyScalar(t));

    return { state, labelNext: 'R1 = R1 + R2', labelPrev: 'R1 = R1 - R2' };
  },
  (t, state) => {
    // R1 = 0.5*R1
    state[0] = state[0].sub(state[0].clone().multiplyScalar(0.5 * t));

    return { state, labelNext: 'R1 = 0.5*R1', labelPrev: 'R1 = 2*R1' };
  }
];

export const controls = Controls.addSlideShow(state, transitionSteps);
