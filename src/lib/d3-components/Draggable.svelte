<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { drag, select } from 'd3';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';

  export let offset = new Vector2(0, 0);
  export let position = new Vector2(0, 0);
  export let color = PrimeColor.ultramarine;
  export let snap = false;

  let g: SVGGElement;

  $: dx = offset.x;
  $: dy = offset.y;

  function dragstarted(event: DragEvent) {
    select(g).raise();
    select(g).attr('cursor', 'grabbing');
  }

  function dragged(event: DragEvent) {
    offset.x = event.x - position.x;
    offset.y = event.y - position.y;

    // console.log({ event });
  }

  function dragended() {
    select(g).attr('cursor', 'grab');

    if (snap) {
      offset.x = Math.round(offset.x);
      offset.y = Math.round(offset.y);
    }
  }

  onMount(() => {
    offset = new Vector2(0, 0);

    select(g)
      .call(
        drag<SVGGElement, unknown>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .raise();
  });
</script>

<circle class="pulse" cx={position.x + offset.x} cy={position.y + offset.y} r=".5" fill={color} />
<circle cx={position.x + offset.x} cy={position.y + offset.y} r=".125" fill={color} />

<slot {dx} {dy} />

<g bind:this={g}>
  <circle cx={position.x + dx} cy={position.y + dy} r=".5" opacity="0" />
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
