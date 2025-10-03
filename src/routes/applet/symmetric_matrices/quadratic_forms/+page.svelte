<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';
  import { parameterizeConic } from './conic';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { withSign } from '$lib/utils/FormatString';
  import { DiagonalMatrix } from '$lib/controls/DiagonalMatrix.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';

  const formulas = $derived.by(() => {
    let f = new Formula('\\$1 x_1^2 \\$2 x_1 x_2 \\$3 x_2^2 = \\$4')
      .addAutoParam(a, PrimeColor.orange)
      .addAutoParam(withSign(b), PrimeColor.orange)
      .addAutoParam(withSign(c), PrimeColor.orange)
      .addAutoParam(round(k, 2), PrimeColor.raspberry);

    return [f];
  });

  const mat = new DiagonalMatrix(new Matrix2(3, 2, 2, 6), 'A', PrimeColor.orange, 0.5);

  const controls = $derived.by(() => {
    return Controls.add(mat).addSlider(3, -10, 10, 0.1, PrimeColor.raspberry, {
      label: 'k',
      valueFn: (v) => round(v, 2).toString()
    });
  });

  const k = $derived(controls[1]);

  const plane_position = $derived(new Vector3(0, k, 0));

  let a = $derived(mat.value.tl);
  let b = $derived(2 * mat.value.tr);
  let c = $derived(mat.value.br);

  let func_k = $derived(parameterizeConic(a, b, c, round(k, 2)));

  // find primary axes
  let primary_axes: Vector2[] = $derived.by(() => {
    let A = new Matrix2(a, b / 2, b / 2, c);

    return A.getEigenVectors();
  });

  // predefined level lines
  const level_lines: number[] = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

  let level_line_functions = $derived(
    level_lines.map((z_level) => ({
      z_level,
      func: parameterizeConic(a, b, c, z_level)
    }))
  );
</script>

<Canvas3D {controls} {formulas} title="Quadratic forms" splitCanvas2DProps={{ cameraZoom: 2 }}>
  <Axis3D x1="x_1" x2="x_2" x3="x_3" />

  {#if a == 0 && b == 0 && c == 0 && k == 0}
    <AutoPlanes values={[0, 0]}>
      {#snippet children(value, index, planeSegment, _)}
        {@const color = index == 0 ? PrimeColor.raspberry : PrimeColor.blue}
        <PlaneFromNormal
          position={new Vector3(0, value, 0)}
          normal={new Vector3(0, 1, 0)}
          {planeSegment}
          {color}
        />
      {/snippet}
    </AutoPlanes>
  {:else}
    <Surface3D
      func={(x, y) => a * x * x + b * x * y + c * y * y}
      color={PrimeColor.blue}
      opacity={0.7}
    />

    <PlaneFromNormal
      normal={new Vector3(0, 1, 0)}
      position={plane_position}
      color={PrimeColor.raspberry}
    />
  {/if}

  {#snippet splitCanvas2DChildren()}
    {#if func_k?.xFunc}
      <ParameterizedFunction2D
        xFunc={func_k?.xFunc}
        yFunc={func_k?.yFunc}
        tStart={func_k?.line ? -30 : -4}
        tEnd={func_k?.line ? 30 : 4}
        stepSize={0.1}
        color={PrimeColor.raspberry}
        width={0.06}
      />
    {/if}

    {#if func_k?.xFunc2 && func_k?.yFunc2}
      <ParameterizedFunction2D
        xFunc={func_k?.xFunc2}
        yFunc={func_k?.yFunc2}
        tStart={func_k?.line ? -30 : -4}
        tEnd={func_k?.line ? 30 : 4}
        stepSize={0.1}
        color={PrimeColor.raspberry}
        width={0.06}
      />
    {/if}

    {#each level_line_functions as { func } (func)}
      {#if func?.xFunc}
        <ParameterizedFunction2D
          xFunc={func?.xFunc}
          yFunc={func?.yFunc}
          tStart={func?.line ? -30 : -4}
          tEnd={func?.line ? 30 : 4}
          color={PrimeColor.blue + PrimeColor.opacity(0.5)}
        />
      {/if}

      {#if func?.xFunc2 && func?.yFunc2}
        <ParameterizedFunction2D
          xFunc={func?.xFunc2}
          yFunc={func?.yFunc2}
          tStart={func?.line ? -30 : -4}
          tEnd={func?.line ? 30 : 4}
          color={PrimeColor.blue + PrimeColor.opacity(0.5)}
        />
      {/if}
    {/each}

    {#each primary_axes as pa (pa.toArray().toString())}
      <InfiniteLine2D
        direction={pa}
        isDashed={true}
        color={PrimeColor.darkGreen + PrimeColor.opacity(0.5)}
      />
    {/each}
  {/snippet}
</Canvas3D>
