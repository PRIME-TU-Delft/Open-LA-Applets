<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { drag, select } from 'd3';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';

  export let id: string;
  export let position = new Vector2(0, 0);
  export let color = PrimeColor.ultramarine;
  export let snap = false;

  let g: SVGGElement;

  function dragstarted(event: DragEvent) {
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
    const localPosition = localStorage.getItem(id);
    console.log(id);

    if (localPosition) {
      const { x, y } = JSON.parse(localPosition);
      position.x = x;
      position.y = y;
    } else {
      localStorage.setItem(id, JSON.stringify(position));
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

<circle class="pulse" cx={position.x} cy={position.y} r=".5" fill={color} />
<circle cx={position.x} cy={position.y} r=".125" fill={color} />

<slot />

<g bind:this={g}>
  <circle cx={position.x} cy={position.y} r=".5" opacity="0" />
</g>

<style>
  .pulse {
    animation: pulse 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  @keyframes pulse {
    0% {
      r: 0.5;
      opacity: 0.5;
    }
    50% {
      r: 0.3;
      opacity: 0.25;
    }
    100% {
      r: 0.5;
      opacity: 0.5;
    }
  }
</style>
