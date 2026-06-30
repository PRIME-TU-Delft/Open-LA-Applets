<script lang="ts" module>
  import type { Canvas2DProps } from '$lib/d3/CanvasD3.svelte';
  import type { Snippet } from 'svelte';

  export type GridCanvas2DProps = Omit<Canvas2DProps, 'width' | 'height' | 'children'> & {
    gridColumn?: string;
    gridRow?: string;
    children: Snippet;
  };
</script>

<script lang="ts">
  import CanvasD3 from '$lib/d3/CanvasD3.svelte';
  import { getContext, onMount, onDestroy } from 'svelte';
  import { CANVAS_GRID_KEY, type CanvasGridContext } from './CanvasGrid.svelte';

  let {
    gridColumn = 'auto',
    gridRow = 'auto',
    children,
    ...canvasProps
  }: GridCanvas2DProps = $props();

  let containerWidth = $state(500);
  let containerHeight = $state(300);

  const gridContext = getContext<CanvasGridContext>(CANVAS_GRID_KEY);
  // svelte-ignore state_referenced_locally
  const draggables = canvasProps.draggables;

  onMount(() => {
    if (gridContext && draggables?.length) {
      gridContext.registerDraggables(draggables);
    }
  });

  onDestroy(() => {
    if (gridContext && draggables?.length) {
      gridContext.unregisterDraggables(draggables);
    }
  });
</script>

<div
  style="grid-column: {gridColumn}; grid-row: {gridRow}; overflow: hidden; border-width: 2px"
  class="border-blue-500"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <CanvasD3 width={containerWidth} height={containerHeight} {...canvasProps}>
    {@render children()}
  </CanvasD3>
</div>
