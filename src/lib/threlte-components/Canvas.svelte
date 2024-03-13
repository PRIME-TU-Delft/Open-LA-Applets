<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import Konami from '$lib/components/Konami.svelte';
  import type { Canvas2DProps } from '$lib/d3-components';
  import D3Canvas from '$lib/d3-components/D3Canvas.svelte';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { Canvas, T } from '@threlte/core';
  import { Vector3 } from 'three';
  import type { Canvas3DProps } from '.';
  import CustomRenderer from './CustomRenderer.svelte';
  import SetCamera from './SetCamera.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let cameraPosition: Canvas3DProps['cameraPosition'] = new Vector3(10, 10, 10);
  export let enablePan: Canvas3DProps['enablePan'] = false;
  export let cameraZoom: Canvas3DProps['cameraZoom'] = 29;
  export let width: Canvas3DProps['width'] = '100%';
  export let height: Canvas3DProps['height'] = 'auto';

  export let splitCanvas2DProps: Partial<Canvas2DProps> = {};
  export let splitCanvas3DProps: Partial<Canvas3DProps> = {};

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let controls: Controls<G> | undefined = undefined;
  export let formulas: Formula[] = [];

  let enableEasterEgg = false;
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
  bind:controls
  --height={height}
  --width={width}
>
  {@const totalWidth = $$slots.splitCanvas || $$slots.splitCanvas3d ? width / 2 : width}

  <Canvas size={{ width: totalWidth, height }}>
    <SetCamera position={cameraPosition} {resetKey} {enablePan} zoom={cameraZoom} />

    <Konami on:konami={() => (enableEasterEgg = !enableEasterEgg)} debug />

    {#if enableEasterEgg}
      <CustomRenderer />
    {/if}

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>

  {#if $$slots.splitCanvas}
    <D3Canvas width={totalWidth} {height} {...splitCanvas2DProps}>
      <slot name="splitCanvas" />
    </D3Canvas>
  {:else if $$slots.splitCanvas3d}
    <div class="canvas3d relative overflow-hidden">
      <Canvas size={{ width: totalWidth, height }}>
        {#if enableEasterEgg}
          <CustomRenderer />
        {/if}

        <SetCamera
          position={splitCanvas3DProps?.cameraPosition}
          {resetKey}
          enablePan={splitCanvas3DProps?.enablePan}
          zoom={splitCanvas3DProps?.cameraZoom}
        />
        <T.AmbientLight intensity={1} />

        <slot name="splitCanvas3d" />
      </Canvas>
    </div>
  {/if}
</AbstractCanvas>
