<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';
  import { Latex2D } from '.';
  import D3Canvas from './D3Canvas.svelte';
  import { GridType } from './grids/GridTypes';
  import type { Formula } from '$lib/utils/Formulas';

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let width = '100%';
  export let height = 'auto';
  export let zoom = 1;
  export let formulas: Formula[] = [];

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
  {formulas}
  {isIframe}
  let:width
  let:height
  bind:sliders
  --height={height}
  --width={width}
>
  {@const totalWidth = $$slots.splitCanvas ? width / 2 : width}

  <D3Canvas {zoom} width={totalWidth} {height} {gridType}>
    <!-- origin label-->
    <Latex2D latex={'O'} offset={new Vector2(-0.15, -0.16)} />

    <slot />
  </D3Canvas>

  {#if $$slots.splitCanvas}
    <div class="canvasDivider" />

    <D3Canvas {zoom} width={totalWidth} {height} {gridType}>
      <!-- origin label-->
      <Latex2D latex={'O'} offset={new Vector2(-0.15, -0.16)} />

      <slot name="splitCanvas" />
    </D3Canvas>
  {/if}
</AbstractCanvas>

<style lang="postcss">
  .canvasDivider {
    position: static;
    left: calc(50% - 2px);
    top: 0;
    width: 4px;
    height: 100%;
    @apply shadow-2xl bg-slate-500;
  }
</style>
