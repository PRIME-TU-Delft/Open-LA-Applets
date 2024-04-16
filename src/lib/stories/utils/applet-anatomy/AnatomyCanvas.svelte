<script lang="ts">
  import { Canvas3D } from '$lib/threlte-components';
  import type { Formula } from '$lib/utils/Formulas';
  import type { Controls } from '$lib/utils/Controls';
  import { T } from '@threlte/core';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let title: string = 'default without sliders';
  export let controls: Controls<G> | undefined = undefined;
  export let inIframe: boolean = false;
  export let showFormulasDefault: boolean = false;
  export let formulas: Formula[] = [];
</script>

<Canvas3D {formulas} {inIframe} {showFormulasDefault} height="20rem" {title} bind:controls>
  <T.Mesh>
    <T.BoxGeometry />
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
</Canvas3D>
