<script lang="ts">
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, PlaneFromPoints, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import Point from '$lib/threlte-components/Point.svelte';

  const u = new Vector3(1, 2, -2); // Vector U;
  const v = new Vector3(3, 1, 0); // Vector V;
  const w = u.clone().add(v); // Vector W = U + V;

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
  function createFormulas(t1: boolean, t2: boolean) {
    const t3 = true;
    labelstring = '\\mathrm{Span}\\{\\mathbf{u},\\mathbf{v},\\mathbf{w}\\}';
    const formulaString = [t1, t2, t3]
      .filter((t) => t)
      .map((_, i) => {
        return `\\mathbf{\\$${i + 1}}`;
      })
      .join(', '); // array of strings joined by comma

    let formula = new Formula('\\mathbf{Span}\\{' + formulaString + '\\}');

    // Selectivly add parameters to the formula
    if (t1) formula = formula.addAutoParam('u', PrimeColor.blue);
    if (t2) formula = formula.addAutoParam('v', PrimeColor.raspberry);
    formula = formula.addAutoParam('w', PrimeColor.darkGreen);

    return [formula];
  }

  function reloadString(t1: boolean, t2: boolean) {
    let labelstring = '\\mathrm{Span}\\{';
    if (t1) labelstring = labelstring.concat('\\mathbf{u},');
    if (t2) labelstring = labelstring.concat('\\mathbf{v},');
    return labelstring.concat('\\mathbf{w}\\}');
  }

  $: formulas = createFormulas(controls[0], controls[1]);
  $: labelstring = reloadString(controls[0], controls[1]);
</script>

<Canvas3D {formulas} bind:controls>
  <!-- Vector u -->
  {#if controls[0]}
    <Vector3D direction={u} length={u.length()} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.blue} />
  {/if}

  <!-- Vector v -->
  {#if controls[1]}
    <Vector3D direction={v} length={v.length()} color={PrimeColor.raspberry} />
    <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.raspberry} />
  {/if}

  <!-- Vector w -->
  {#if controls[2]}
    <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
    <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.darkGreen} />

    {#if controls[0]}
      <Vector3D
        origin={u}
        direction={v}
        length={v.length()}
        striped
        hideHead
        color={PrimeColor.black}
      />
    {/if}

    {#if controls[1]}
      <!-- helper striped Vectors : vw -->
      <Vector3D
        origin={v}
        direction={u}
        length={u.length()}
        striped
        hideHead
        color={PrimeColor.black}
      />
    {/if}
  {/if}

  <!--  Span label -->
  <Latex3D latex={labelstring} position={w.clone().normalize().multiplyScalar(8)} offset={1.5} />

  {#if !controls[0] && !controls[1] && controls[2]}
    <!-- Line span w -->
    <Vector3D
      origin={w.clone().normalize().multiplyScalar(-15)}
      direction={w}
      length={30}
      color={PrimeColor.yellow}
      hideHead
      radius={0.04}
    />
  {:else if controls[0] && !controls[1] && !controls[2]}
    <!-- Line span u -->
    <Vector3D
      origin={u.clone().normalize().multiplyScalar(-15)}
      direction={u}
      length={30}
      color={PrimeColor.yellow}
      hideHead
      radius={0.04}
    />
  {:else if !controls[0] && controls[1] && !controls[2]}
    <!-- Line span v -->
    <Vector3D
      origin={v.clone().normalize().multiplyScalar(-15)}
      direction={v}
      length={30}
      color={PrimeColor.yellow}
      hideHead
      radius={0.04}
    />
  {:else if !controls[0] && !controls[1] && !controls[2]}
    <Point color={PrimeColor.yellow} />
  {:else}
    <!-- Plane span -->
    <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.yellow} size={15} />
  {/if}

  <Axis3D />
</Canvas3D>
