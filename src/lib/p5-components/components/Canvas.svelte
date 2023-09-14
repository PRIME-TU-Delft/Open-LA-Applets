<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import Axis2D from './Axis.svelte';
  import { GridType } from './Grids';
  import P5Canvas from './P5Canvas.svelte';

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let sliders: Sliders | undefined = undefined;

  export let gridType: GridType = GridType.none;
</script>

<AbstractCanvas
  {title}
  {background}
  {showFormulasDefault}
  {isIframe}
  let:width
  let:height
  bind:sliders
>
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
