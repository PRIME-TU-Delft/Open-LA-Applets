<script lang="ts">
  import { Vector2 } from 'three';
  import Line from './Line.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  export let vs: [Vector2, Vector2]; // vectors to draw angle between
  export let origin: Vector2 = new Vector2(0, 0); // common orgin of vectors
  export let size = 0.3; // size of drawn angle
  export let color = PrimeColor.black; // color of used lines
  export let lineWidth = 0.02;

  //resize vectors
  $: u1 = vs[0].clone().multiplyScalar(size / vs[0].length());
  $: u2 = vs[1].clone().multiplyScalar(size / vs[1].length());
</script>

<!-- draw two lines to represent right angle if perpendicular -->

{#if Math.abs(u1.dot(u2)) <= 0.005 && !u1.equals(u2)}
  <Line
    {color}
    width={lineWidth}
    start={u1.clone().add(origin)}
    end={u1.clone().add(u2).add(origin)}
  />
  <Line
    {color}
    width={lineWidth}
    start={u2.clone().add(origin)}
    end={u1.clone().add(u2).add(origin)}
  />
{/if}
