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
  import { Vector3 } from 'three';

  const controls = Controls.addToggle(true, '\\mathbf{v_3}', PrimeColor.raspberry).addToggle(
    true,
    '\\mathbf{v_4}',
    PrimeColor.orange
  );

  const v1 = new MathVector3(2, 0, 0);
  const v2 = new MathVector3(0, 2, 0);
  const v3 = new MathVector3(1, 2, 0);
  const v4 = new MathVector3(1, 2, 1);

  /**
   * @description Create a string representation of the span of the vectors
   * The first two vectors are fixed and the third one is controlled by the user
   * @example
   * Span\{\mathbf{v_1}, \mathbf{v_2}, \mathbf{v_3}\}
   */
  const formulas = $derived.by(() => {
    const pre = '\\mathrm{Span}\\{';
    const res = [true, true, ...controls.values]
      .map((b, i) => (b ? `\\mathbf{v_${i + 1}}` : ''))
      .filter(Boolean)
      .join(', ');
    const post = '\\} \\subset ';

    const isIn = controls[1] ? '\\mathbb{R}^3' : '\\mathbb{R}^2';

    return [new Formula(pre + res + post + isIn)];
  });
</script>

<Canvas3D
  {controls}
  {formulas}
  showFormulasDefault
  cameraZoom={50}
  cameraPosition={new Vector3(7, 6.5, 14)}
>
  <Vector3D direction={v1} length={2} color={PrimeColor.blue} />
  <Latex3D
    latex={'\\mathbf{v_1}'}
    position={v1}
    offset={new MathVector3(0, 0, 0.1)}
    color={PrimeColor.blue}
    hasBackground
  />

  <Vector3D direction={v2} length={2} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={'\\mathbf{v_2}'}
    position={v2}
    offset={new MathVector3(0, 0, 0.1)}
    color={PrimeColor.darkGreen}
    hasBackground
  />

  {#if controls[0]}
    <Vector3D
      direction={v3}
      length={v3.clone().multiplyScalar(2).length()}
      color={PrimeColor.raspberry}
    >
      {#snippet children(endPoint)}
        <Latex3D
          latex={'\\mathbf{v_3}'}
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
      direction={v4}
      length={v3.clone().multiplyScalar(2).length()}
      color={PrimeColor.orange}
    >
      {#snippet children(endPoint)}
        <Latex3D
          latex={'\\mathbf{v_4}'}
          position={endPoint}
          offset={new MathVector3(0, 0, 0.1)}
          color={PrimeColor.orange}
          hasBackground
        />
      {/snippet}
    </Vector3D>
  {/if}

  <Span3D toggles={[true, true, controls[1]]} vectors={[v1, v2, v4]} />

  <Axis3D />
</Canvas3D>
