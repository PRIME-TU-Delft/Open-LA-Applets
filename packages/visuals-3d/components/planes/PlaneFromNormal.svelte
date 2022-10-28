<script lang="ts">
  /**
   * This component is defined by a normal vector and a center position.
   */

  import { beforeUpdate, onMount } from 'svelte';

  import { Vector3, Plane } from 'three';

  import getRandomColor from 'ui/utils/primeColors';
  import { PlaneSegments } from '../../utils/Segments';

  import AbstractPlane from './PlaneAbstract.svelte';

  export let point: Vector3 = new Vector3(0, 0, 0);
  export let normal: Vector3 = new Vector3(1, 1, 1);
  export let color = getRandomColor();
  export let size = 10;
  export let opacity = 0.8;
  export let planeSegment = PlaneSegments.default();

  let plane: Plane;

  onMount(() => {
    normal = normal.normalize();

    plane = new Plane().setFromNormalAndCoplanarPoint(normal, point);
  });

  beforeUpdate(() => {
    if (!plane) return;

    normal = normal.normalize();
    const planeCoplainarPoint: Vector3 = new Vector3();
    plane.coplanarPoint(planeCoplainarPoint);

    // Check if normal and coplanar point have changed
    if (plane.normal.equals(normal) && planeCoplainarPoint.equals(point)) return;

    plane.setFromNormalAndCoplanarPoint(normal.normalize(), point);
  });
</script>

{#if plane}
  {#key point || normal}
    <AbstractPlane {plane} {color} {size} {opacity} {planeSegment} />
  {/key}
{/if}
