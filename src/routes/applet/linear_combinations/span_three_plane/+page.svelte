<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const u = new Vector3(1, 2, -2); // Vector U;
  const v = new Vector3(3, 1, 0); // Vector V;
  const w = u.clone().add(v); // Vector W = U + V;

  let controls = Controls.addToggle(true, '\\mathbf{u}')
    .addToggle(true, '\\mathbf{v}')
    .addToggle(true, '\\mathbf{w}');

  const formulas = $derived.by(() => {
    const t1 = controls[0];
    const t2 = controls[1];
    const t3 = controls[2];

    const formulaString = [t1, t2, t3]
      .filter((t) => t)
      .map((_, i) => {
        return `\\mathbf{\\$${i + 1}}`;
      })
      .join(', '); // array of strings joined by comma

    let formula = new Formula('\\mathbf{Span}\\{' + formulaString + '\\}');

    // Selectivly add parameters to the formula
    if (t1) formula = formula.addAutoParam('u', PrimeColor.raspberry);
    if (t2) formula = formula.addAutoParam('v', PrimeColor.blue);
    if (t3) formula = formula.addAutoParam('w', PrimeColor.darkGreen);

    return [formula];
  });

  const labelstring = $derived.by(() => {
    let res = '\\mathrm{Span}\\{';

    if (!controls[0] && !controls[1] && !controls[2]) return res + '\\}';

    if (controls[0]) res += '\\mathbf{u},';
    if (controls[1]) res += '\\mathbf{v},';
    if (controls[2]) res += '\\mathbf{w},';
    return res.slice(0, -1) + '\\}';
  });

  const enabledVectors = $derived([u, v, w].filter((_, i) => controls[i as 0 | 1 | 2]));
</script>

<Canvas3D title="Span of three vectors lying in the same plane" {formulas} {controls}>
  {#if controls[0]}
    <!-- Vector u -->
    <Vector3D direction={u} length={u.length()} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.blue} />
  {/if}

  {#if controls[1]}
    <!-- Vector v -->
    <Vector3D direction={v} length={v.length()} color={PrimeColor.raspberry} />
    <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.raspberry} />
  {/if}

  {#if controls[2]}
    <!-- Vector w -->
    <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} alwaysOnTop />
    <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.darkGreen} />
  {/if}

  {#if enabledVectors.length >= 2}
    <!-- Plane span -->
    <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.yellow} size={15} />
    <Latex3D latex={labelstring} position={w.clone().normalize().multiplyScalar(8)} extend={1.5} />
  {:else if enabledVectors.length == 1}
    <!-- Line span -->
    <Vector3D
      origin={enabledVectors[0].clone().normalize().multiplyScalar(-15)}
      direction={enabledVectors[0]}
      length={30}
      color={PrimeColor.yellow}
      hideHead
      radius={1.5}
    />

    <Latex3D latex={labelstring} position={enabledVectors[0]} extend={1.5} />
  {:else if enabledVectors.length == 0}
    <Point3D position={new Vector3()} color={PrimeColor.yellow} />
    <Latex3D latex={labelstring} position={new Vector3(1, 1, 0)} extend={0.5} />
  {/if}

  <Axis3D />
</Canvas3D>
