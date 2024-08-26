<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const state = {
    scaleX: 1,
    scakeXAgain: 1,
    rotate: 0,
    displayAs: 'image',
    showPoint: false,
    transformType: 'none'
  };
  type S = typeof state;

  const transitionSteps = [
    (t: number, state: S) => {
      state.transformType = 'scale';

      state.scaleX = state.scaleX - 0.99 * t;

      state.displayAs = t > 0.9 ? 'line' : 'image';

      return { state, labelNext: 'Scale x to 0', labelPrev: 'Original state' };
    },
    (t: number, state: S) => {
      state.transformType = 'rotate';

      state.rotate = state.rotate - 90 * t;

      return { state, labelNext: 'Rotate 90 degrees', labelPrev: 'Rotate 90 degrees' };
    },
    (t: number, state: S) => {
      state.transformType = 'scale';

      state.scakeXAgain = state.scakeXAgain - 0.99 * t;

      state.displayAs = t > 0.9 ? 'dot' : 'line';

      return { state, labelNext: 'Scale x to 0 again', labelPrev: 'Widen along x axis' };
    }
  ];

  const formulas = $derived.by(() => {
    const t1 = new Formula(
      'T_1(x) = \\begin{bmatrix}0 & 0 \\\\ 0 & 1\\end{bmatrix} \\begin{bmatrix}x_1 \\\\ x_2\\end{bmatrix} = \\begin{bmatrix}0 \\\\ x_2\\end{bmatrix}'
    );
    const t2 = new Formula(
      'T_2(x) = \\begin{bmatrix}0 & 1 \\\\ -1 & 0\\end{bmatrix} \\begin{bmatrix}x_1 \\\\ x_2\\end{bmatrix} = \\begin{bmatrix}x_2 \\\\ -x_1\\end{bmatrix}'
    );

    if (controls[0].transformType == 'scale') {
      return [t1];
    } else if (controls[0].transformType == 'rotate') {
      return [t2];
    } else {
      return [];
    }
  });

  const controls = Controls.addSlideShow(state, transitionSteps);
</script>

<Canvas2D {controls} {formulas} showFormulasDefault>
  {#if controls[0].displayAs == 'image'}
    <image
      transform="translate(0,2) scale({controls[0].scaleX},-1)"
      x="0"
      y="0"
      width="2"
      height="2"
      xlink:href="/house.svg"
    />
  {:else if controls[0].displayAs == 'line'}
    <g transform="rotate({controls[0].rotate})">
      <Vector2D
        direction={new Vector2(0, 1)}
        length={2 * controls[0].scakeXAgain}
        color={PrimeColor.yellow}
        hideHead
      />
    </g>
  {:else}
    <Point2D position={new Vector2()} color={PrimeColor.yellow} />
  {/if}
</Canvas2D>
