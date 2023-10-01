<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';
  import { Latex2D } from '.';
  import D3Canvas from './D3Canvas.svelte';

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let sliders: Sliders | undefined = undefined;

  // export let gridType: GridType = GridType.none;
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
  <D3Canvas {width} {height}>
    <!-- TODO:  Grids -->
    <!-- <slot name="grids">
      {#if gridType}
        <Axis2D {gridType} />
      {/if}
    </slot> -->

    <!-- origin label-->
    <Latex2D latex={'O'} offset={new Vector2(-0.15, -0.16)} />

    <slot />
  </D3Canvas>

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
</AbstractCanvas>
