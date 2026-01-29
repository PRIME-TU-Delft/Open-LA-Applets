<script>
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Span3D from '$lib/threlte/Span3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  const controls = Controls.addToggle(true, '\\mathbf{w_3}', PrimeColor.raspberry).addToggle(
    false,
    '\\mathbf{w_4}',
    PrimeColor.orange
  );

  const w1 = new MathVector3(2, 0, 0);
  const w2 = new MathVector3(0, 2, 0);
  const w3 = new MathVector3(1, 2, 0);
  const w4 = new MathVector3(1, 2, 1);

  /**
   * @description Create a string representation of the span of the vectors
   * The first two vectors are fixed and the third one is controlled by the user
   * @example
   * Span\{\mathbf{w_1}, \mathbf{w_2}, \mathbf{w_3}\}
   */
  const formulas = $derived.by(() => {
    const pre = '\\mathrm{Span}\\{';
    const res = [true, true, ...controls.values]
      .map((b, i) => (b ? `\\mathbf{w_${i + 1}}` : ''))
      .filter(Boolean)
      .join(', ');
    const post = '\\} ';

    const isIn = '\\subset' + (controls[1] ? '\\mathbb{R}^3' : '\\mathbb{R}^2');

    const f1 = new Formula(pre + res + post + isIn);

    const isIndependent = (!controls[0] && controls[1]) || (!controls[0] && !controls[1]);

    const f2 = new Formula('\\{' + res + post + `= \\text{\\$1}`).addAutoParam(
      isIndependent
        ? $_('applets.linear_independence.linind_example_in_3d.independent')
        : $_('applets.linear_independence.linind_example_in_3d.dependent')
    );

    return [f1, f2];
  });
</script>

<Canvas3D
  {controls}
  {formulas}
  showFormulasDefault
  cameraZoom={50}
  cameraPosition={new MathVector3(14, 7, 6.5)}
>
  <Vector3D direction={w1} length={2} color={PrimeColor.blue} />
  <Latex3D
    latex={'\\mathbf{w_1}'}
    position={w1}
    offset={new MathVector3(0, 0, 0.1)}
    color={PrimeColor.blue}
    hasBackground
  />

  <Vector3D direction={w2} length={2} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={'\\mathbf{w_2}'}
    position={w2}
    offset={new MathVector3(0, 0, 0.1)}
    color={PrimeColor.darkGreen}
    hasBackground
  />

  {#if controls[0]}
    <Vector3D
      direction={w3}
      length={w3.clone().multiplyScalar(2).length()}
      color={PrimeColor.raspberry}
    >
      {#snippet children(endPoint)}
        <Latex3D
          latex={'\\mathbf{w_3}'}
          position={endPoint}
          offset={new MathVector3(0, 0, 0.1)}
          color={PrimeColor.raspberry}
          hasBackground
        />
      {/snippet}
    </Vector3D>
  {/if}

  {#if controls[1]}
    <Vector3D
      direction={w4}
      length={w3.clone().multiplyScalar(2).length()}
      color={PrimeColor.orange}
    >
      {#snippet children(endPoint)}
        <Latex3D
          latex={'\\mathbf{w_4}'}
          position={endPoint}
          offset={new MathVector3(0, 0, 0.1)}
          color={PrimeColor.orange}
          hasBackground
        />
      {/snippet}
    </Vector3D>
  {/if}

  <Span3D toggles={[true, true, controls[1]]} vectors={[w1, w2, w4]} />

  <Axis3D />
</Canvas3D>
