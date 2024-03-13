<script lang="ts">
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, PlaneFromPoints, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';
    import { Formula } from '$lib/utils/Formulas';

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
  function createFormulas(t1: boolean, t2: boolean, t3: boolean) {
    const formulaString = [t1, t2, t3]
      .filter((t) => t)
      .map((_, i) => {
        return `\\mathbf{\\$${i + 1}}`;
      })
      .join(', '); // array of strings joined by comma

    let formula = new Formula('\\mathbf{Span}\\{' + formulaString + '\\}');

    // Selectivly add parameters to the formula
    if (t1) formula = formula.addAutoParam('u', PrimeColor.blue);
    if (t2) formula = formula.addAutoParam('v', PrimeColor.darkGreen);
    if (t3) formula = formula.addAutoParam('w', PrimeColor.red);

    return [formula];
  }

  $: formulas = createFormulas(controls[0], controls[1], controls[2]);

</script>

<Canvas3D {formulas} bind:controls>

{#if controls[0]}
  <!-- Vector u -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.blue} />
  {#if controls[2]}
    <Vector3D
    origin={u}
    direction={v}
    length={v.length()}
    striped
    hideHead
    color={PrimeColor.black}
  />
  {/if}
  
{/if}

{#if controls[1]}
  <!-- Vector v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.red} />
  <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.red} />
  {#if controls[2]}
    <!-- helper striped Vectors -->
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
{#if controls[2]}
  <!-- Vector w -->
  <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.darkGreen} />
  
{/if}












  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.yellow} size={15} />
  <Latex3D
    latex={'\\mathrm{Span}\\{\\mathbf{u},\\mathbf{v},\\mathbf{w}\\}'}
    position={w.clone().normalize().multiplyScalar(8)}
    offset={1.5}
  />

  <Axis3D />
</Canvas3D>
