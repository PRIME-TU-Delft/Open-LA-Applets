<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Canvas, T } from '@threlte/core';
  import { Vector3 } from 'three';
  import SetCamera from './SetCamera.svelte';
  import type { Formula } from '$lib/utils/Formulas';

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let zoom = 29;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let width = '100%';
  export let height = 'auto';
  export let isIframe = false; // Is the scene inside an iframe?
  export let sliders: Sliders | undefined = undefined;
  export let formulas: Formula[] = [];
</script>

<AbstractCanvas
  {title}
  {background}
  {showFormulasDefault}
  {formulas}
  {isIframe}
  let:width
  let:height
  let:resetKey
  bind:sliders
  --height={height}
  --width={width}
>
  {@const totalWidth = $$slots.splitCanvas ? width / 2 : width}

  <div class="canvas3d relative overflow-hidden">
    <Canvas size={{ width: totalWidth, height }}>
      <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

      <slot name="lights">
        <T.AmbientLight intensity={1} />
      </slot>

      <slot />
    </Canvas>
  </div>

  <!-- For adding a 2nd 3D canvas next to another 3D canvas -->
  <!-- ! Camera position is identical to the first ! -->
  {#if $$slots.splitCanvas}
    <div class="canvasDivider" />

    <div class="canvas3d relative overflow-hidden">
      <Canvas size={{ width: totalWidth, height }}>
        <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />
        <T.AmbientLight intensity={1} />

        <slot name="splitCanvas" />
      </Canvas>
    </div>
  {/if}
</AbstractCanvas>

<style lang="postcss">
  .canvasDivider {
    left: calc(50% - 2px);
    @apply static top-0 w-1 h-full shadow-2xl bg-slate-500;
  }
</style>
