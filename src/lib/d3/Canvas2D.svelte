<script lang="ts">
  import { page } from '$app/state';
  import Confetti from '$lib/components/Confetti.svelte';
  import Konami from '$lib/components/Konami.svelte';
  import ResizableDivider from '$lib/components/ResizableDivider.svelte';
  import Scene from '$lib/components/Scene.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import Camera3D from '$lib/threlte/Camera3D.svelte';
  import CustomRenderer from '$lib/threlte/CustomRenderer.svelte';
  import { parseUrl } from '$lib/utils/URLParsing';
  import { Canvas } from '@threlte/core';
  import { NoToneMapping, Vector2 } from 'three';
  import CanvasD3 from './CanvasD3.svelte';
  import type { CanvasProps } from './CanvasType';

  let {
    title,
    showFormulasDefault,
    formulas,
    legendItems,
    controls,
    splitFormulas,
    splitLegendItems,
    splitCanvas2DProps,
    splitCanvas3DProps,
    children,
    splitCanvas2DChildren,
    splitCanvas3DChildren,

    // Canvas2DProps
    cameraPosition = new Vector2(0, 0),
    cameraZoom = 1,
    initialViewBox: viewBox,
    axis,
    labels,
    enablePan = true,
    draggables = [],
    defaultLeftDivision
  }: CanvasProps = $props();

  const hasSplitCanvas = $derived(
    splitCanvas2DChildren != undefined || splitCanvas3DChildren != undefined
  );

  // Concat all draggables and pass them to the Scene component to be able to reset them
  const allDraggables = $derived([...draggables, ...(splitCanvas2DProps?.draggables ?? [])]);

  const renderMode = $derived(activityState.isActive ? 'on-demand' : 'manual');

  let enableEasterEgg = $state(false);

  let leftCanvasWidth = $state<number | null>(null);

  $effect.pre(() => {
    const searchParams = page?.url?.searchParams;

    if (!searchParams) return; // No search params

    const urlProps = parseUrl(searchParams);

    // 2d props
    if (urlProps.params2D.position2D) cameraPosition = urlProps.params2D.position2D;
    if (urlProps.params2D.zoom2D) cameraZoom = urlProps.params2D.zoom2D;

    // 2d split props
    if (splitCanvas2DProps && urlProps.paramsSplit2D.position2D)
      splitCanvas2DProps.cameraPosition = urlProps.paramsSplit2D.position2D;

    if (splitCanvas2DProps && urlProps.paramsSplit2D.zoom2D)
      splitCanvas2DProps.cameraZoom = urlProps.paramsSplit2D.zoom2D;

    // 3d split props
    if (splitCanvas3DProps && urlProps.paramsSplit3D.position3D)
      splitCanvas3DProps.cameraPosition = urlProps.paramsSplit3D.position3D;

    if (splitCanvas3DProps && urlProps.paramsSplit3D.zoom3D)
      splitCanvas3DProps.cameraZoom = urlProps.paramsSplit3D.zoom3D;
  });
</script>

<!-- @component A component that renders a 2D canvas with draggables and formulas.
@props 
  - title: string - The title of the scene.
  - draggables: Draggable[] - The draggables that are in the scene.
  - controls: boolean - Whether the controls are shown.
  - showFormulasDefault: boolean - Whether the formulas are shown by default.
  - formulas: Formula[] - The formulas that are shown.
  - splitFormulas: Formula[] - Whether the formulas are split.
  - splitCanvas2DProps: Canvas2DProps - The props for the split 2D canvas.
  - splitCanvas3DProps: Camera3DProps - The props for the split 3D canvas.
  - children: Snippet - The children of the scene.
  - splitCanvas2DChildren: Snippet - The children of the split 2D canvas.
  - splitCanvas3DChildren: Snippet - The children of the split 3D canvas.
  - cameraPosition: Vector2 - The position of the camera.
  - cameraZoom: number - The zoom of the camera.
  - axis: AxisProps - The properties of the axis.
  - labels: LabelProps - Axis labels and their positions.
  - enablePan: boolean - Whether the pan is enabled. 

@description
  A component that renders a 2D canvas with draggables and formulas.

@example
  <Canvas2D title="Title">
    ...

{#snippet splitCanvas2DChildren()}
{/snippet}

{#snippet splitCanvas3DChildren()}
{/snippet}
  </Canvas2D>
  
-->

<Scene
  {title}
  draggables={allDraggables}
  {controls}
  {showFormulasDefault}
  {legendItems}
  {formulas}
  {splitFormulas}
  {splitLegendItems}
>
  {#snippet sceneChildren(width: number, height: number)}
    {@const defaultCanvasWidth = width / 2}
    {@const leftWidth = leftCanvasWidth ?? defaultCanvasWidth}
    {@const rightWidth = width - leftWidth}
    {@const canvasWidth = hasSplitCanvas ? leftWidth : width}
    <CanvasD3
      width={canvasWidth}
      {height}
      {cameraPosition}
      {cameraZoom}
      initialViewBox={viewBox}
      {axis}
      {labels}
      {enablePan}
      {draggables}
    >
      {@render children()}
    </CanvasD3>

    {#if hasSplitCanvas}
      <ResizableDivider
        onResize={(newLeftWidth) => (leftCanvasWidth = newLeftWidth)}
        {defaultLeftDivision}
      />
    {/if}

    {#if splitCanvas2DChildren}
      <CanvasD3 {height} width={rightWidth} {...splitCanvas2DProps} isSplit>
        {@render splitCanvas2DChildren()}
      </CanvasD3>
    {:else if splitCanvas3DChildren}
      <Confetti isSplit />
      <div style="width: {rightWidth}px" class="overflow-hidden">
        <Canvas {renderMode} toneMapping={NoToneMapping}>
          <Camera3D {...splitCanvas3DProps} isSplit />

          {@render splitCanvas3DChildren()}

          {#if enableEasterEgg}
            <CustomRenderer />
          {/if}
        </Canvas>
      </div>
    {/if}
  {/snippet}
</Scene>

<Konami onKonami={() => (enableEasterEgg = !enableEasterEgg)} />
