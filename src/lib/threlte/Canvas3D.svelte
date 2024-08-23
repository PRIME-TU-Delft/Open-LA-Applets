<script lang="ts">
  import { page } from '$app/stores';
  import Konami from '$lib/components/Konami.svelte';
  import type { SceneProps } from '$lib/components/Scene.svelte';
  import Scene from '$lib/components/Scene.svelte';
  import type { Canvas2DProps } from '$lib/d3/CanvasD3.svelte';
  import CanvasD3 from '$lib/d3/CanvasD3.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { parseUrl } from '$lib/utils/parseUrl';
  import { hasProps } from '$lib/utils/hasProps';
  import { Canvas } from '@threlte/core';
  import type { Snippet } from 'svelte';
  import { NoToneMapping, Vector3 } from 'three';
  import Camera3D, { type Camera3DProps } from './Camera3D.svelte';
  import CustomRenderer from './CustomRenderer.svelte';

  type CanvasProps = SceneProps &
    Omit<Camera3DProps, 'children' | 'width'> & {
      title?: string;
      splitCanvas2DProps?: Omit<Canvas2DProps, 'children' | 'width'>;
      splitCanvas3DProps?: Camera3DProps; // Not implemented yet
      children: Snippet;
      splitCanvas2DChildren?: Snippet;
      splitCanvas3DChildren?: Snippet;
    };

  let {
    // General props
    title,
    showFormulasDefault,
    formulas,
    controls,
    splitFormulas,
    splitCanvas2DProps = {},
    splitCanvas3DProps = {},
    children,
    splitCanvas2DChildren,
    splitCanvas3DChildren,

    // Canvas2DProps
    cameraPosition = new Vector3(10, 10, 10),
    cameraZoom = 29,
    enablePan = false
  }: CanvasProps = $props();

  const canvasWidth = $derived(
    hasProps(splitCanvas2DProps) || hasProps(splitCanvas3DProps)
      ? globalState.width / 2
      : globalState.width
  );

  // Concat all draggables and pass them to the Scene component to be able to reset them
  const allDraggables = $derived([...(splitCanvas2DProps?.draggables ?? [])]);

  const renderMode = $derived(activityState.isActive ? 'on-demand' : 'manual');

  let enableEasterEgg = $state(false);

  $effect.pre(() => {
    const searchParams = $page.url.searchParams;

    const urlProps = parseUrl(searchParams);

    // 2d props
    if (urlProps.params3D.position3D) cameraPosition = urlProps.params3D.position3D;
    if (urlProps.params3D.zoom3D) cameraZoom = urlProps.params3D.zoom3D;

    // 2d split props
    if (urlProps.paramsSplit2D.position2D)
      splitCanvas2DProps.cameraPosition = urlProps.paramsSplit2D.position2D;

    if (urlProps.paramsSplit2D.zoom2D)
      splitCanvas2DProps.cameraZoom = urlProps.paramsSplit2D.zoom2D;

    // 3d split props
    if (urlProps.paramsSplit3D.position3D)
      splitCanvas3DProps.cameraPosition = urlProps.paramsSplit3D.position3D;

    if (urlProps.paramsSplit3D.zoom3D)
      splitCanvas3DProps.cameraZoom = urlProps.paramsSplit3D.zoom3D;
  });
</script>

<Scene
  {title}
  draggables={allDraggables}
  {controls}
  {showFormulasDefault}
  {formulas}
  {splitFormulas}
>
  <div style="width: {canvasWidth}px" class="overflow">
    <Canvas {renderMode} toneMapping={NoToneMapping}>
      <Camera3D {cameraPosition} {cameraZoom} {enablePan} />

      {@render children()}

      {#if enableEasterEgg}
        <CustomRenderer />
      {/if}
    </Canvas>
  </div>

  {#if splitCanvas2DChildren}
    <CanvasD3 width={canvasWidth} {...splitCanvas2DProps}>
      {@render splitCanvas2DChildren()}
    </CanvasD3>
  {:else if splitCanvas3DChildren}
    <div style="width: {canvasWidth}px" class="overflow-hidden">
      <Canvas {renderMode} toneMapping={NoToneMapping}>
        <Camera3D {...splitCanvas3DProps} isSplit />

        {@render splitCanvas3DChildren()}

        {#if enableEasterEgg}
          <CustomRenderer />
        {/if}
      </Canvas>
    </div>
  {/if}
</Scene>

<Konami onKonami={() => (enableEasterEgg = !enableEasterEgg)} />
