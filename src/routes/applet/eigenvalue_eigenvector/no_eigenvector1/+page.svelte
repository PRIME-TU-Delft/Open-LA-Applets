<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2, Vector3 } from 'three';

  const defaultState = {
    w: new Vector2(2, -2),
    avLabel: 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}'
  };

  const steps: SlideShowSteps<typeof defaultState> = [
    (t, state) => {
      state.w = state.w.clone().add(new Vector2(0, 3).multiplyScalar(t));

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=3\\mathbf{w}';
      else 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return { state, labelNext: 'First eigenvector', labelPrev: 'No eigenvector' };
    },
    (t, state) => {
      state.w = state.w.clone().add(new Vector2(-4, 0).multiplyScalar(t));

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=-1\\mathbf{w}';
      else 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return { state, labelNext: 'Second eigenvector', labelPrev: 'First eigenvector' };
    },
    (t, state) => {
      state.w = state.w.clone().add(new Vector2(0, -2).multiplyScalar(t));

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=3\\mathbf{w}';
      else 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return { state, labelNext: 'Third eigenvector', labelPrev: 'Second eigenvector' };
    },
    (t, state) => {
      state.w = state.w.clone().add(new Vector2(4, 0).multiplyScalar(t));

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=-1\\mathbf{w}';
      else 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return { state, labelNext: 'Fourth eigenvector', labelPrev: 'Third eigenvector' };
    }
  ];

  const controls = Controls.addSlideShow(defaultState, steps, 'No eigenvector');
  const state = $derived(controls[0]);

  const A = new Matrix3(1, 4, 0, 1, 1, 0, 0, 0, 0);

  function rotationMatrix(angle: number) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix3(c, -s, 0, s, c, 0, 0, 0, 0);
  }

  const Aw = $derived.by(() => {
    const w_temp = new Vector3(state.w.x, state.w.y, 0);
    w_temp.applyMatrix3(A);
    return new Vector2(w_temp.x, w_temp.y);
  });

  const formulas = $derived.by(() => {
    const f1 = new Formula('A = \\frac{1}{3}\\begin{bmatrix} 5 & -2 \\\\ -1 & 4 \\end{bmatrix}');
    const f2 = new Formula(
      'A\\mathbf{w} = \\begin{bmatrix} \\$1 \\\\ \\$2 \\end{bmatrix} \\quad \\mathbf{w} = \\begin{bmatrix} \\$3 \\\\ \\$4 \\end{bmatrix}'
    )
      .addAutoParam(round(Aw.x, 1), PrimeColor.blue)
      .addAutoParam(round(Aw.y, 1), PrimeColor.blue)
      .addAutoParam(round(state.w.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(state.w.y, 1), PrimeColor.raspberry);

    return [f1, f2];
  });
</script>

<Canvas2D {controls} {formulas}>
  <!-- W -->
  <Vector2D direction={Aw} length={Aw.length()} color={PrimeColor.blue} />
  <Latex2D
    extend={0.6}
    offset={new Vector2(-0.25, 0.4)}
    latex={state.avLabel}
    position={Aw}
    color={PrimeColor.blue}
  />

  <Vector2D direction={state.w} length={state.w.length()} color={PrimeColor.raspberry} />
  <Latex2D
    offset={new Vector2(-0.25, 0)}
    extend={0.5}
    latex={'\\mathbf{w}'}
    position={state.w}
    color={PrimeColor.raspberry}
  />
</Canvas2D>
