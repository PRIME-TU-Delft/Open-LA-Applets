<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3, Vector4 } from 'three';

  const state = [new Vector4(2, -1, -1, 2), new Vector4(1, 2, 4, 4), new Vector4(4, -2, -4, 6)];
  type S = typeof state;

  const transitionSteps: SlideShowSteps<S> = [
    (t, state) => {
      // R2 = 2*R2
      state[1] = state[1].add(state[1].clone().multiplyScalar(t));

      return { state, labelNext: 'R2 = 2*R2', labelPrev: 'Original state' };
    },
    (t, state) => {
      // R3 = R3 - 2*R1
      state[2] = state[2].sub(state[0].clone().multiplyScalar(2 * t));

      // R2 = R2 - R1
      state[1] = state[1].sub(state[0].clone().multiplyScalar(t));

      return {
        state,
        labelNext: 'R2 = R2 - R1 & R3 = R3 - 2*R1',
        labelPrev: 'R2 = R2 + R1 & R3 = R3 + 2*R1'
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

      // R2 = R2  -9*R3
      state[1] = state[1].sub(state[2].clone().multiplyScalar(9 * t));

      return {
        state,
        labelNext: 'R1 = R1 + R3 & R2 = R2 - 9*R3',
        labelPrev: 'R1 = R1 - R3 & R2 = R2 + 9*R3'
      };
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

  let controls = Controls.addSlideShow(state, transitionSteps);

  const formulas = $derived.by(() => {
    const r = (x: number) => round(x, 1);

    const [r1, r2, r3] = controls[0];
    const f1 = new Formula(`\\begin{bmatrix} 
        \\textcolor{${PrimeColor.raspberry}}{${r(r1.x)}} & \\textcolor{${PrimeColor.raspberry}}{${r(r1.y)}} 
        & \\textcolor{${PrimeColor.raspberry}}{${r(r1.z)}} & ${r(r1.w)} \\\\
        \\textcolor{${PrimeColor.darkGreen}}{${r(r2.x)}} & \\textcolor{${PrimeColor.darkGreen}}{${r(r2.y)}} 
        & \\textcolor{${PrimeColor.darkGreen}}{${r(r2.z)}} & ${r(r2.w)} \\\\
        \\textcolor{${PrimeColor.yellow}}{${r(r3.x)}} & \\textcolor{${PrimeColor.yellow}}{${r(r3.y)}} 
        & \\textcolor{${PrimeColor.yellow}}{${r(r3.z)}} & ${r(r3.w)} \\\\
      \\end{bmatrix}`);

    return [f1];
  });
</script>

<Canvas3D {formulas} {controls}>
  {@const v0 = new Vector3(controls[0][0].y, controls[0][0].z, controls[0][0].x)}
  {@const v1 = new Vector3(controls[0][1].y, controls[0][1].z, controls[0][1].x)}
  {@const v2 = new Vector3(controls[0][2].y, controls[0][2].z, controls[0][2].x)}
  {@const v3 = new Vector3(controls[0][1].w, controls[0][2].w, controls[0][0].w)}

  <Vector3D direction={v0} length={v0.length()} color={PrimeColor.raspberry} />
  <Vector3D direction={v1} length={v1.length()} color={PrimeColor.darkGreen} />
  <Vector3D direction={v2} length={v2.length()} color={PrimeColor.yellow} />
  <Vector3D direction={v3} length={v3.length()} color={PrimeColor.black} />

  <Axis3D showNumbers />
</Canvas3D>
