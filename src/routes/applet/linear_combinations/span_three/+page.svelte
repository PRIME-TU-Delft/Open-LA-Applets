<script lang="ts">
  import { Axis3D, Canvas3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import CubePlaneLine from './CubePlaneLine.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import Point from '$lib/threlte-components/Point.svelte';

  const u = new Vector3(1, 3, 3); // Direction of vector u
  const v = new Vector3(3, 2, -3); // Direction of vector v
  const w = new Vector3(1, -2, 0); // Direction of vector w

  let controls = Controls.addToggle(true, '\\mathbf{u}')
    .addToggle(true, '\\mathbf{v}')
    .addToggle(true, '\\mathbf{w}');

  /**
   * Creates formulas based on the given inputs.
   *
   * @param {number} a - The first input number.
   * @param {number} b - The second input number.
   * @returns {string[]} - An array of formulas.
   */
  function createFormulas(t1: boolean, t2: boolean, t3: boolean) {
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
  }

  $: formulas = createFormulas(controls[0], controls[1], controls[2]);
</script>

<Canvas3D cameraPosition={new Vector3(7.63, 6.3, 14.22)} {formulas} bind:controls>
  <CubePlaneLine toggles={controls} uvw={[u, v, w]} />

  {#if controls[0]}
    <Vector3D direction={u} length={u.length()} color={PrimeColor.raspberry} />
    <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.raspberry} />
  {/if}
  {#if controls[1]}
    <Vector3D direction={v} length={v.length()} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.blue} />
  {/if}
  {#if controls[2]}
    <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
    <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.darkGreen} />
  {/if}

  {#if !controls[0] && !controls[1] && !controls[2]}
    <Point color={PrimeColor.yellow} />
  {/if}

  <Axis3D />
</Canvas3D>
