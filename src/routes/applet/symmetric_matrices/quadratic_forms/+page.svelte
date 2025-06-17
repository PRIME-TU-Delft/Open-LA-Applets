<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
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

  let a = 1;
  let b = 1;
  let c = 1;

  let func = $derived(`${a} x^2 + ${b} x * y + ${c} y^2`);
  let func_k = $derived(func + '=' + round(k, 2));

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
    {@const domainSize: number = 8}

    <ImplicitFunction2D
      xMin={-domainSize}
      xMax={domainSize}
      yMin={-domainSize}
      yMax={domainSize}
      func={func_k}
      color={PrimeColor.raspberry}
      width={0.06}
    />

    {#each level_lines as z_level}
      <ImplicitFunction2D
        xMin={-domainSize}
        xMax={domainSize}
        yMin={-domainSize}
        yMax={domainSize}
        func={func + '=' + z_level}
        color={PrimeColor.blue + PrimeColor.opacity(0.5)}
      />
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
