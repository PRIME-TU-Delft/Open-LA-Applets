<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import Axis2D from './Axis.svelte';
  import { GridType } from './Grids';
  import P5Canvas from './P5Canvas.svelte';

  export let gridType: GridType = GridType.none;
</script>

<AbstractCanvas let:width let:height>
  <P5Canvas {gridType} size={{ width, height }}>
    <!-- Grids -->
    <slot name="grids">
      {#if gridType}
        <Axis2D {gridType} />
      {/if}
    </slot>

    <slot />
  </P5Canvas>

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
</AbstractCanvas>
