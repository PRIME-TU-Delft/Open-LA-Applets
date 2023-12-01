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
  export let width = '100%';
  export let height = 'auto';
  export let zoom = 1;
  //these need to be moved to axis.svelte
  export let axisLength = 10;
  export let showOrigin = true;
  export let showAxisNumbers = true;

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
  {@const totalWidth = $$slots.splitCanvas ? width / 2 : width}

  <D3Canvas {zoom} width={totalWidth} {height} {gridType}>
    <!-- origin label-->
    {#if showOrigin}
      <Latex2D latex={'O'} offset={new Vector2(-0.28, -0.11)} />
    {/if}

    <!-- axis numbers  -->
    {#if showAxisNumbers}
      {#each [...Array(axisLength + 1).keys()]
        .flatMap((a) => [-a, a])
        .filter((a) => a != 0) as position}
        <Latex2D latex={position.toLocaleString()} position={new Vector2(position - 0.07, -0.1)} />
        {#if position > 0}
          <Latex2D
            latex={position.toLocaleString()}
            position={new Vector2(-0.28, position + 0.12)}
          />
        {:else}
          <Latex2D
            latex={position.toLocaleString()}
            position={new Vector2(-0.5, position + 0.12)}
          />
        {/if}
      {/each}
    {/if}

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

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
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
