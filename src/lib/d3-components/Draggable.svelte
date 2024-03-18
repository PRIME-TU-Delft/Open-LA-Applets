<script lang="ts">
  import { page } from '$app/stores';
  import { activityStore } from '$lib/activityStore';
  import { INTERACTIVITY_RADIUS, POINT_SIZE } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { drag, select } from 'd3';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';

  export let id: string;
  export let position = new Vector2(0, 0);
  export let color: PrimeColor = PrimeColor.blue;
  export let snap = false;

  let g: SVGGElement;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function dragstarted(_: DragEvent) {
    select(g).raise();
    select(g).attr('cursor', 'grabbing');
  }

  function dragged(event: DragEvent) {
    position.x = event.x;
    position.y = event.y;
  }

  function dragended() {
    select(g).attr('cursor', 'grab');

    if (snap) {
      position.x = Math.round(position.x);
      position.y = Math.round(position.y);
    }
  }

  onMount(() => {
    const localUrl = $page?.url?.href?.split('/').slice(-2).join('-');

    const index = id + localUrl;
    const localPosition = localStorage.getItem(index);

    if (localPosition) {
      const { x, y } = JSON.parse(localPosition);
      position.x = x;
      position.y = y;
    } else {
      localStorage.setItem(index, JSON.stringify(position));
    }

    // Setup the drag behavior
    select(g)
      .call(
        drag<SVGGElement, unknown>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .raise(); // Means the drag element is lifted to the highest z-index
  });
</script>

<circle
  class="pulse"
  r={INTERACTIVITY_RADIUS}
  opacity="0.5"
  fill={color}
  role="button"
  tabindex="0"
  on:mousedown={activityStore.enable}
  style="--x:{position.x}; --y:{position.y}"
/>
<circle cx={position.x} cy={position.y} r={POINT_SIZE} fill={color} />

<slot />

<g bind:this={g}>
  <circle cx={position.x} cy={position.y} r={INTERACTIVITY_RADIUS} opacity="0" />
</g>

<style>
  .pulse {
    translate: calc(var(--x) * 1px) calc(var(--y) * 1px);
    animation: pulse 3s infinite;
  }

  @keyframes pulse {
    0% {
      scale: 1;
      opacity: 0.5;
    }
    70% {
      scale: 0.5;
      opacity: 0.25;
    }
    100% {
      scale: 1;
      opacity: 0.5;
    }
  }
</style>
