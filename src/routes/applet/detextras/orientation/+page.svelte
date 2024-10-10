<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2, Vector3 } from 'three';

  const controls = Controls.addSlider(0, 0, 360, 10, PrimeColor.cyan, { loop: true }).addToggle(
    false,
    '\\text{A}',
    PrimeColor.raspberry,
    { isSwitch: true, switchRightSide: '\\text{B}' }
  );

  const formulas = $derived.by(() => {
    const matrix = controls[1] ? '3&1\\\\1&3' : '1&3\\\\3&1';
    const f1 = new Formula(`T(\\mathbf{x})=\\begin{bmatrix} ${matrix} \\end{bmatrix}\\mathbf{x}`);
    const f2 = new Formula(
      `\\det ${controls[1] ? 'B = ' : 'A = -'}8 ${controls[1] ? '\\gt' : '\\lt'}0`
    );

    return [f1, f2];
  });

  const transformMatrix = $derived(
    controls[1] ? new Matrix3(3, 1, 0, 1, 3, 0, 0, 0, 1) : new Matrix3(1, 3, 0, 3, 1, 0, 0, 0, 1)
  );

  function transformVector(v: Vector2, angle: number): Vector2 {
    let temp = new Vector3(v.x, v.y, 0);

    temp = temp.applyAxisAngle(new Vector3(0, 0, 1), (angle * Math.PI) / 180);
    temp = temp.applyMatrix3(transformMatrix);

    return new Vector2(temp.x, temp.y);
  }

  const v1 = new Vector2(1, 0);
  const v2 = new Vector2(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
  const tv1 = $derived(transformVector(v1, controls[0]));
  const tv2 = $derived(transformVector(v2, controls[0]));

  const transformMatrixStr = $derived(controls[1] ? 'matrix(3 1 1 3 0 0)' : 'matrix(1 3 3 1 0 0)');
</script>

<Canvas2D {formulas} showFormulasDefault cameraZoom={3} {controls}>
  <Circle2D color={PrimeColor.darkGreen} />

  {@render scene()}

  <g transform="rotate({controls[0]})">
    <Vector2D direction={v1} length={v1.length()} color={PrimeColor.cyan} radius={0.04}></Vector2D>

    <Vector2D direction={v2} length={v2.length()} color={PrimeColor.orange} radius={0.04} />
  </g>

  <g transform="rotate({controls[0]}) translate({v1.x}, {v1.y}) rotate({-controls[0]})">
    <Latex2D latex={'\\mathbf{v}_1'} offset={new Vector2(0, 0.1)} color={PrimeColor.cyan} />
  </g>

  <g transform="rotate({controls[0]}) translate({v2.x}, {v2.y}) rotate({-controls[0]})">
    <Latex2D latex={'\\mathbf{v}_2'} offset={new Vector2(0, 0.1)} color={PrimeColor.orange} />
  </g>

  {#snippet splitCanvas2DChildren()}
    <g transform="rotate(45)">
      <ellipse
        cx="0"
        cy="0"
        rx="4"
        ry="2"
        fill="none"
        stroke={PrimeColor.darkGreen}
        stroke-width={0.07}
      />
    </g>

    <g transform={transformMatrixStr}>
      {@render scene()}
    </g>

    <Vector2D direction={tv1} length={tv1.length()} color={PrimeColor.cyan} radius={0.1}>
      {#snippet children(endPoint)}
        <Latex2D
          position={endPoint}
          latex={'T(\\mathbf{v}_1)'}
          extend={0.5}
          offset={new Vector2(-0.5, 0.2)}
          color={PrimeColor.cyan}
        />
      {/snippet}
    </Vector2D>

    <Vector2D direction={tv2} length={tv2.length()} color={PrimeColor.orange} radius={0.1}>
      {#snippet children(endPoint)}
        <Latex2D
          position={endPoint}
          latex={'T(\\mathbf{v}_2)'}
          extend={0.5}
          offset={new Vector2(-0.5, 0.2)}
          color={PrimeColor.orange}
        />
      {/snippet}
    </Vector2D>
  {/snippet}
</Canvas2D>

{#snippet scene()}
  <g transform="rotate({controls[0]})">
    <Angle2D
      startAngle={0}
      endAngle={(1 / 4) * Math.PI}
      color={PrimeColor.raspberry}
      distance={0.5}
      width={0.015}
      hasHead
    />
  </g>
{/snippet}
