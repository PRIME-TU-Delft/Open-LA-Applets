<script lang="ts">
  import { beforeUpdate, onMount } from 'svelte';

  import { Vector3, Plane } from 'three';

  import getRandomColor from 'utils/PrimeColors';
  import PlaneSegments from 'utils/Segments';

  import AbstractPlane from './PlaneAbstract.svelte';

  export let points: [Vector3, Vector3, Vector3] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1)
  ];
  export let color = getRandomColor();
  export let size = 10;
  export let opacity = 0.8;
  export let planeSegment = PlaneSegments.default();

  let plane: Plane;

  onMount(() => {
    plane = new Plane().setFromCoplanarPoints(points[0], points[1], points[2]);
  });

  beforeUpdate(() => {
    if (!plane) return;

    plane.setFromCoplanarPoints(points[0], points[1], points[2]);
  });
</script>

{#if plane}
  {#key points}
    <AbstractPlane {plane} {color} {size} {opacity} {planeSegment} />
  {/key}
{/if}
