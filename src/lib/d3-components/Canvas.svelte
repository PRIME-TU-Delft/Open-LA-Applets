<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';
  import { Latex2D } from '.';
  import D3Canvas from './D3Canvas.svelte';
  import { GridType } from './grids/GridTypes';

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let sliders: Sliders | undefined = undefined;
  export let gridType: GridType = GridType.Square;
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
  <D3Canvas {width} {height} {gridType}>
    <!-- origin label-->
    <Latex2D latex={'O'} offset={new Vector2(-0.28, -0.11)} />

    <slot />
  </D3Canvas>

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
</AbstractCanvas>
