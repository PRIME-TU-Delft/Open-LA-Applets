<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import SetCamera from '$lib/threlte-components/SetCamera.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Canvas, T } from '@threlte/core';
  import { Vector3 } from 'three';
  import D3Canvas from './D3Canvas.svelte';
  import { GridType } from './grids/GridTypes';

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let width = '100%';
  export let height = 'auto';
  export let zoom = 1;
  export let zoom3d = 29;

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
  let:resetKey
  bind:sliders
  --height={height}
  --width={width}
>
  {@const totalWidth = $$slots.splitCanvas || $$slots.splitCanvas3d ? width / 2 : width}

  <D3Canvas {zoom} width={totalWidth} {height} {gridType}>
    <slot />
  </D3Canvas>

  {#if $$slots.splitCanvas}
    <div class="canvasDivider" />

    <D3Canvas {zoom} width={totalWidth} {height} {gridType}>
      <slot name="splitCanvas" />
    </D3Canvas>
  {/if}

  {#if $$slots.splitCanvas3d}
    <div class="canvasDivider" />

    <div class="canvas3d relative overflow-hidden">
      <Canvas size={{ width: totalWidth, height }}>
        <SetCamera position={cameraPosition} {resetKey} {enablePan} zoom={zoom3d} />

        <slot name="lights">
          <T.AmbientLight intensity={1} />
        </slot>

        <slot name="splitCanvas3d" />
      </Canvas>
    </div>
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
