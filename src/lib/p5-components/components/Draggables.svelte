<script lang="ts">
  import getRandomColor from '$lib/utils/PrimeColors';
  import type { Vector2 } from 'three';
  import Point from './Point.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { Draggable, draggables } from './CanvasUtils';
  import { getCanvasContext } from './CanvasContext';
  import { Grid } from './Grids';
  import { get } from 'svelte/store';

  export let position: Vector2;
  export let defaultPosition: Vector2;
  export let color: string = getRandomColor(); //Color of both cone and stem
  export let snap: boolean = false; // Whether to snap to grid

  const gridType = getCanvasContext().gridType;
  let newDraggable: Draggable | undefined;

  $: dragPosition = newDraggable?.position;

  // Update position to be able to bind to
  $: position = $dragPosition || position;

  function snapFunction(pos: Vector2) {
    return Grid.snapFunction(pos, get(gridType));
  }

  onMount(() => {
    // Register the draggable with the canvas
    newDraggable = new Draggable(defaultPosition, color, snap);

    draggables.add(newDraggable);
  });

  onDestroy(() => {
    // Unregister the draggable with the canvas
    if (!newDraggable) return;

    draggables.remove(newDraggable.key);

    newDraggable = undefined;
  });
</script>

{#if newDraggable && dragPosition}
  {@const pos = $dragPosition}
  {#if pos}
    {@const snapPos = snap ? snapFunction(pos) : pos}
    <Point radius={15} position={snapPos} {color} opacity={0.5} pulse />

    <Point radius={100} position={snapPos} {color} opacity={0.1} />
    <slot dragPosition={pos} />
  {/if}
{/if}
