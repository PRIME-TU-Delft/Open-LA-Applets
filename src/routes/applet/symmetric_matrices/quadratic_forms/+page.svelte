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
  import { eigs, matrix } from 'mathjs';
  import { Vector2, Vector3 } from 'three';

  const formulas = $derived.by(() => {
    let f = new Formula('\\$1 x_1^2 + \\$2 x_1 x_2 + \\$3 x_2^2 = \\$4')
      .addAutoParam(a, PrimeColor.yellow)
      .addAutoParam(b, PrimeColor.yellow)
      .addAutoParam(c, PrimeColor.yellow)
      .addAutoParam(round(k, 1), PrimeColor.raspberry);

    return [f];
  });

  const controls = $derived.by(() => {
    return Controls.addSlider(3, -10, 10, 0.1, PrimeColor.raspberry, {
      label: 'k',
      valueFn: (v) => round(v, 1).toString()
    }).addToggle(true, '\\text{Primary axes}', PrimeColor.darkGreen);
  });

  const k = $derived(controls[0]);
  const show_primary = $derived(controls[1]);

  const plane_position = $derived(new Vector3(0, k, 0));

  // let a = 1;
  // let b = -2;
  // let c = -3;

  let a = 1;
  let b = 2;
  let c = 2;

  function parameterizeConic(
    a: number,
    b: number,
    c: number,
    d: number
  ): {
    xFunc: string;
    yFunc: string;
    xFunc2?: string;
    yFunc2?: string;
  } | null {
    // For ellipses:
    // const D = 4 * a * c - (b*b);

    // const xFunc = `sqrt(${d}/${a}) * (sin(t) - ${b}/sqrt(${D}) * cos(t))`;
    // const yFunc = `( 2 * sqrt(${a}*${d}) / sqrt(${D}) ) * cos(t)`;

    // return { xFunc, yFunc };

    const delta = b * b - 4 * a * c;
    const angle = 0.5 * Math.atan2(b, a - c);
    const cos = `cos(${angle.toFixed(6)})`;
    const sin = `sin(${angle.toFixed(6)})`;

    const trace = a + c;
    const det = a * c - (b / 2) ** 2;
    const eigenVal1 = trace / 2 + Math.sqrt(trace ** 2 / 4 - det);
    const eigenVal2 = trace / 2 - Math.sqrt(trace ** 2 / 4 - det);

    if (delta < 0) {
      // Ellipse
      const uExpr = `sqrt(${d / eigenVal1}) * cos(t)`;
      const vExpr = `sqrt(${d / eigenVal2}) * sin(t)`;
      return {
        xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
        yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
      };
    } else if (delta > 0) {
      // Hyperbola — two branches!
      const uExpr = `sqrt(${d / eigenVal1}) * cosh(t)`;
      const vExpr = `sqrt(${Math.abs(d / eigenVal2)}) * sinh(t)`;

      return {
        xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
        yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`,
        xFunc2: `(-${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
        yFunc2: `(-${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
      };
    } else {
      console.error('Parabola or degenerate conic not yet supported');
      return null; //! Parabola or degenerate conic not supported in this version.
    }
  }

  let func_k = $derived(parameterizeConic(a, b, c, k));

  // find primary axes
  let primary_axes: Vector2[] = $derived.by(() => {
    let A = matrix([
      [a, b / 2],
      [b / 2, c]
    ]);
    let ev_result = eigs(A).eigenvectors;

    let res: Vector2[] = [];

    ev_result.forEach((v) => {
      const vec: any = v.vector;
      const x = vec._data[0];
      const y = vec._data[1];
      res.push(new Vector2(x, y));
    });

    return res;
  });

  // predefined level lines
  const level_lines: number[] = Array.from(Array(9).keys());
</script>

<Canvas3D {controls} {formulas} title="Quadratic forms" splitCanvas2DProps={{ cameraZoom: 2 }}>
  <Axis3D />

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

  {#snippet splitCanvas2DChildren()}
    {@const domainSize: number = 2}

    {#if func_k?.xFunc}
      <ParameterizedFunction2D
        xFunc={func_k?.xFunc}
        yFunc={func_k?.yFunc}
        color={PrimeColor.raspberry}
        width={0.06}
      />
    {/if}

    {#if func_k?.xFunc2 && func_k?.yFunc2}
      <ParameterizedFunction2D
        xFunc={func_k?.xFunc2}
        yFunc={func_k?.yFunc2}
        color={PrimeColor.raspberry}
        width={0.06}
      />
    {/if}

    {#each level_lines as z_level}
      {@const func = parameterizeConic(a, b, c, z_level)}

      {#if func?.xFunc}
        <ParameterizedFunction2D
          xFunc={func?.xFunc}
          yFunc={func?.yFunc}
          color={PrimeColor.blue + PrimeColor.opacity(0.5)}
        />
      {/if}

      {#if func?.xFunc2 && func?.yFunc2}
        <ParameterizedFunction2D
          xFunc={func?.xFunc2}
          yFunc={func?.yFunc2}
          color={PrimeColor.blue + PrimeColor.opacity(0.5)}
        />
      {/if}
    {/each}

    {#if show_primary}
      {#each primary_axes as pa}
        <InfiniteLine2D
          direction={pa}
          isDashed={true}
          color={PrimeColor.black + PrimeColor.opacity(0.5)}
        />
      {/each}
    {/if}
  {/snippet}
</Canvas3D>
