<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import Konami from '$lib/components/Konami.svelte';
  import type { Canvas3DProps } from '$lib/threlte-components';
  import CustomRenderer from '$lib/threlte-components/CustomRenderer.svelte';
  import SetCamera from '$lib/threlte-components/SetCamera.svelte';
  import type { Controller, Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { Canvas, T } from '@threlte/core';
  import { Vector2 } from 'three';
  import type { Canvas2DProps } from '.';
  import D3Canvas from './D3Canvas.svelte';
  import { GridType } from './grids/GridTypes';

  export let cameraPosition: Canvas2DProps['cameraPosition'] = new Vector2(0, 0);
  export let cameraZoom: Canvas2DProps['cameraZoom'] = 1;
  export let gridType: Canvas2DProps['gridType'] = GridType.Square;
  export let tickLength: Canvas2DProps['tickLength'] = 30;

  export let splitCanvas2DProps: Partial<Canvas2DProps> = {};
  export let splitCanvas3DProps: Partial<Canvas3DProps> = {};

  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let formulas: Formula[] = [];
  export let inIframe = false;
  export let width = '100%';
  export let height = '100%';

  type G = $$Generic<readonly Controller<number | boolean>[]>;
  export let controls: Controls<G> | undefined = undefined;

  let enableEasterEgg = false;
</script>

<AbstractCanvas
  {title}
  {background}
  {showFormulasDefault}
  {formulas}
  {inIframe}
  let:width
  let:height
  bind:controls
  --canvas-height={height}
  --width={width}
>
  {@const totalWidth = $$slots.splitCanvas || $$slots.splitCanvas3d ? width / 2 : width}
  <D3Canvas {tickLength} {cameraPosition} {cameraZoom} width={totalWidth} {height} {gridType}>
    <slot />
  </D3Canvas>

  {#if $$slots.splitCanvas}
    <D3Canvas width={totalWidth} {height} {...splitCanvas2DProps}>
      <slot name="splitCanvas" />
    </D3Canvas>
  {:else if $$slots.splitCanvas3d}
    <div class="canvas3d relative overflow-hidden">
      <Canvas size={{ width: totalWidth, height }}>
        <Konami on:konami={() => (enableEasterEgg = !enableEasterEgg)} />

        {#if enableEasterEgg}
          <CustomRenderer />
        {/if}

        <SetCamera
          position={splitCanvas3DProps?.cameraPosition}
          enablePan={splitCanvas3DProps?.enablePan}
          zoom={splitCanvas3DProps?.cameraZoom}
        />
        <T.AmbientLight intensity={1} />

        <slot name="splitCanvas3d" />
      </Canvas>
    </div>
  {/if}
</AbstractCanvas>
