<script lang="ts">
  import { Canvas3D } from '$lib/threlte-components';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Sliders } from '$lib/utils/Slider';
  import { T } from '@threlte/core';

  export let title: string = 'default without sliders';
  export let sliders: Sliders | undefined = undefined;
  export let isIframe: boolean = false;
  export let showFormulasDefault: boolean = false;
  export let formulas: Formula[] = [];

  function setFormulas(x: number, y: number, z: number) {
    const area = Math.abs(x * y * z);
    const f1 = new Formula('Area = |\\$1| * |\\$2| * |\\$3| = \\$4')
      .addAutoParam(x, PrimeColor.red)
      .addAutoParam(y, PrimeColor.yellow)
      .addAutoParam(z, PrimeColor.darkGreen)
      .addAutoParam(area, PrimeColor.blue);

    return [f1];
  }

  $: if (sliders && sliders?.sliders.length > 0) {
    formulas = setFormulas(sliders.x, sliders.y, sliders.z);
  }
</script>

<Canvas3D {formulas} {isIframe} {showFormulasDefault} height="20rem" {title} bind:sliders>
  <T.Mesh>
    {#if sliders && sliders?.sliders.length > 0}
      <T.BoxGeometry args={[sliders.x, sliders.y, sliders.z]} />
    {:else}
      <T.BoxGeometry args={[1, 2, 3]} />
    {/if}
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
</Canvas3D>
