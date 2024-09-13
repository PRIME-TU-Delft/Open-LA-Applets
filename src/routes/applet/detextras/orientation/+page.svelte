<script>
  import { Controls } from '$lib/controls/Controls';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addSlider(0, 0, 360, 10, PrimeColor.cyan, { loop: true }).addToggle(
    false,
    '\\text{Reverse direction}',
    PrimeColor.raspberry
  );

  const formulas = $derived.by(() => {
    const matrix = controls[1] ? '3&1\\\\1&3' : '1&3\\\\3&1';
    const f1 = new Formula(`T(\\mathbf{x})=\\begin{bmatrix} ${matrix} \\end{bmatrix}\\mathbf{x}`);
    const f2 = new Formula(
      `\\det A = ${controls[1] ? '' : '-'}8 ${controls[1] ? '\\gt' : '\\lt'}0`
    );

    return [f1, f2];
  });

  const transformMatrix = $derived(controls[1] ? 'matrix(3 1 1 3 0 0)' : 'matrix(1 3 3 1 0 0)');
</script>

<Canvas2D {formulas} showFormulasDefault cameraZoom={3} {controls}>
  {@render scene()}

  {#snippet splitCanvas2DChildren()}
    <g transform={transformMatrix}>
      {@render scene()}
    </g>
  {/snippet}
</Canvas2D>

{#snippet scene()}
  <Circle2D color={PrimeColor.darkGreen} />

  <g transform="rotate({controls[0]})">
    <Angle2D
      startAngle={0}
      endAngle={(1 / 4) * Math.PI}
      color={PrimeColor.raspberry}
      distance={0.5}
      width={0.015}
      hasHead
    />
    <Vector2D direction={new Vector2(1, 0)} length={1} color={PrimeColor.cyan} />
    <Vector2D direction={new Vector2(1, 1)} length={1} color={PrimeColor.cyan} />
  </g>
{/snippet}
