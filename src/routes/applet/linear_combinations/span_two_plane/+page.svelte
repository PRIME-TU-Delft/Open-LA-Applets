<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  const u = new MathVector3(-2, 1, 2); // Vector U;
  const v = new MathVector3(0, 3, 1); // Vector V;
  const w = u.clone().add(v); // Vector W = U + V;

  let controls = Controls.addToggle(true, '\\mathbf{u}').addToggle(true, '\\mathbf{v}');

  const formulas = $derived.by(() => {
    const t1 = controls[0];
    const t2 = controls[1];

    const formulaString = [t1, t2]
      .filter((t) => t)
      .map((_, i) => {
        return `\\mathbf{\\$${i + 1}}`;
      })
      .join(', '); // array of strings joined by comma

    let formula = new Formula('\\mathbf{Span}\\{' + formulaString + '\\}');

    // Selectivly add parameters to the formula
    if (t1) formula = formula.addAutoParam('u', PrimeColor.raspberry);
    if (t2) formula = formula.addAutoParam('v', PrimeColor.blue);

    return [formula];
  });

  const labelstring = $derived.by(() => {
    let res = '\\mathrm{Span}\\{';

    if (!controls[0] && !controls[1]) return res + '\\}';

    if (controls[0]) res += '\\mathbf{u},';
    if (controls[1]) res += '\\mathbf{v},';
    return res.slice(0, -1) + '\\}';
  });

  const enabledVectors = $derived([u, v].filter((_, i) => controls[i as 0 | 1 | 2]));
</script>

<Canvas3D title={$_('applets.linear_combinations.span_two_plane.title')} {formulas} {controls}>
  {#if controls[0]}
    <!-- Vector u -->
    <Vector3D direction={u} length={u.length()} color={PrimeColor.blue} alwaysOnTop />
    <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.blue} />
  {/if}

  {#if controls[1]}
    <!-- Vector v -->
    <Vector3D direction={v} length={v.length()} color={PrimeColor.raspberry} alwaysOnTop />
    <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.raspberry} />
  {/if}

  {#if enabledVectors.length >= 2}
    <!-- Plane span -->
    <PlaneFromPoints
      points={[new MathVector3(0, 0, 0), u, v]}
      color={PrimeColor.yellow}
      size={15}
    />
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
    <Point3D position={new MathVector3(0, 0, 0)} color={PrimeColor.yellow} />
    <Latex3D latex={labelstring} position={new MathVector3(0, 1, 1)} extend={0.5} />
  {/if}

  <Axis3D />
</Canvas3D>
