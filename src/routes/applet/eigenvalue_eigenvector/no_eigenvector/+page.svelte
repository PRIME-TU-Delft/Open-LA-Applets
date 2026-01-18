<script lang="ts">
  /* eslint-disable no-restricted-syntax */
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2, Vector3 } from 'three';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  const defaultState = {
    angle: -0.35,
    avLabel: 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}'
  };

  const steps: SlideShowSteps<typeof defaultState> = [
    (t, state) => {
      state.angle = state.angle + 0.5 * t;

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=3\\mathbf{w}';
      else state.avLabel = 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return {
        state,
        labelNext: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector'),
        labelPrev: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.no_eigenvector')
      };
    },
    (t, state) => {
      state.angle = state.angle + 0.7 * t;

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=-1\\mathbf{w}';
      else state.avLabel = 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return {
        state,
        labelNext: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector'),
        labelPrev: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector')
      };
    },
    (t, state) => {
      state.angle = state.angle + 0.3 * t;

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=3\\mathbf{w}';
      else state.avLabel = 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return {
        state,
        labelNext: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector'),
        labelPrev: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector')
      };
    },
    (t, state) => {
      state.angle = state.angle + 0.7 * t;

      if (t > 0.9) state.avLabel = 'A\\mathbf{w}=-1\\mathbf{w}';
      else state.avLabel = 'A\\mathbf{w}\\neq\\lambda\\mathbf{w}';

      return {
        state,
        labelNext: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector'),
        labelPrev: get(_)('applets.eigenvalue_eigenvector.no_eigenvector.an_eigenvector')
      };
    }
  ];

  const controls = Controls.addSlideShow(
    defaultState,
    steps,
    get(_)('applets.eigenvalue_eigenvector.no_eigenvector.no_eigenvector')
  );
  const state = $derived(controls[0]);

  const A = new Matrix3(1, 4, 0, 1, 1, 0, 0, 0, 0);

  function rotationMatrix(angle: number) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix3(c, -s, 0, s, c, 0, 0, 0, 0);
  }

  const w = $derived.by(() => {
    const rotation = rotationMatrix(state.angle * Math.PI);
    const w = new Vector3(Math.sqrt(5), 0, 0);
    w.applyMatrix3(rotation);

    return new Vector2(w.x, w.y);
  });

  const Aw = $derived.by(() => {
    const w_temp = new Vector3(w.x, w.y, 0);
    w_temp.applyMatrix3(A);
    return new Vector2(w_temp.x, w_temp.y);
  });

  const formulas = $derived.by(() => {
    const f1 = new Formula('A = \\begin{bmatrix} 1 & 4 \\\\ 1 & 1 \\end{bmatrix}');
    const f2 = new Formula(
      '\\mathbf{w} = \\begin{bmatrix} \\$3 \\\\ \\$4 \\end{bmatrix} \\space A\\mathbf{w} = \\begin{bmatrix} \\$1 \\\\ \\$2 \\end{bmatrix}'
    )
      .addAutoParam(round(Aw.x, 0), PrimeColor.blue)
      .addAutoParam(round(Aw.y, 0), PrimeColor.blue)
      .addAutoParam(round(w.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(w.y, 1), PrimeColor.raspberry);

    return [f1, f2];
  });
</script>

<Canvas2D {controls} {formulas} cameraZoom={0.9} showFormulasDefault>
  <!-- V1 -->
  <Vector2D direction={Aw} length={Aw.length()} color={PrimeColor.blue} />
  <Latex2D
    extend={0.5}
    offset={new Vector2(-0.25, 0.25)}
    latex={state.avLabel}
    position={Aw}
    color={PrimeColor.blue}
  />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.raspberry} />
  <Latex2D
    offset={new Vector2(-0.25, 0)}
    extend={0.5}
    latex={'\\mathbf{w}'}
    position={w}
    color={PrimeColor.raspberry}
  />
</Canvas2D>
