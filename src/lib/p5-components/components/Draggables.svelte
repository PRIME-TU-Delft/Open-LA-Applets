<script lang="ts">
  import getRandomColor from '$lib/utils/PrimeColors';
  import type { Vector2 } from 'three';
  import Point from './Point.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { Draggable, draggables } from './CanvasUtils';

  export let position: Vector2;
  export let defaultPosition: Vector2;
  export let color: string = getRandomColor(); //Color of both cone and stem

  const key = Symbol('draggable');
  let newDraggable: Draggable | undefined;

  $: dragPosition = newDraggable?.position;

  //   Update position to be able to bind to
  $: position = $dragPosition || position;

  onMount(() => {
    // Register the draggable with the canvas
    newDraggable = new Draggable(defaultPosition, color);

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
    <Point radius={15} position={pos} {color} opacity={0.5} pulse />
    <Point radius={100} position={pos} {color} opacity={0.1} />
    <slot dragPosition={pos} />
  {/if}
{/if}
