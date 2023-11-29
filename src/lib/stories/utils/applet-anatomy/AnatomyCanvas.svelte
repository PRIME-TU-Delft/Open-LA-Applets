<script lang="ts">
  import { Canvas3D } from '$lib/threlte-components';
  import type { Formula } from '$lib/utils/Formulas';
  import type { Sliders } from '$lib/utils/Slider';
  import { T } from '@threlte/core';

  export let title: string = 'default without sliders';
  export let sliders: Sliders | undefined = undefined;
  export let isIframe: boolean = false;
  export let showFormulasDefault: boolean = false;
  export let formulas: Formula[] = [];
</script>

<Canvas3D {formulas} {isIframe} {showFormulasDefault} height="20rem" {title} bind:sliders>
  <T.Mesh>
    <T.BoxGeometry />
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
</Canvas3D>
