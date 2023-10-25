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
  export let width = "100%"
  export let height = "auto"

  // Is the scene inside an iframe?
  export let isIframe = false;
  export let sliders: Sliders | undefined = undefined;
  // The grid type can be None, Square, Triangle
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
  --height={height}
  --width={width}
>
  <D3Canvas {width} {height} {gridType}>
    <!-- origin label-->
    <Latex2D latex={'O'} offset={new Vector2(-0.15, -0.16)} />

    <slot />
  </D3Canvas>

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
</AbstractCanvas>
