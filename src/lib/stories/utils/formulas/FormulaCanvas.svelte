<script lang="ts">
  import { Canvas3D } from '$lib/threlte-components';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Controls } from '$lib/utils/Controls';
  import { T } from '@threlte/core';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let title: string = 'default without sliders';
  export let controls: Controls<G> | undefined = undefined;
  export let isIframe: boolean = false;
  export let showFormulasDefault: boolean = false;
  export let formulas: Formula[] = [];

  function setFormulas<T>(x: T, y: T, z: T) {
    const xf = parseFloat(`${x}`);
    const yf = parseFloat(`${y}`);
    const zf = parseFloat(`${z}`);

    const area = Math.abs(xf * yf * zf);
    const f1 = new Formula('Area = |\\$1| * |\\$2| * |\\$3| = \\$4')
      .addAutoParam(xf, PrimeColor.red)
      .addAutoParam(yf, PrimeColor.yellow)
      .addAutoParam(zf, PrimeColor.darkGreen)
      .addAutoParam(area, PrimeColor.blue);

    return [f1];
  }

  $: if (controls && controls?.controls.length > 0) {
    formulas = setFormulas(controls[0], controls[0], controls[0]);
  }
</script>

<Canvas3D {formulas} {isIframe} {showFormulasDefault} height="20rem" {title} bind:controls>
  <T.Mesh>
    {#if controls && controls?.controls.length > 0}
      <T.BoxGeometry args={[controls[0], controls[0], controls[0]]} />
    {:else}
      <T.BoxGeometry args={[1, 2, 3]} />
    {/if}
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
</Canvas3D>
