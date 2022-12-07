<script lang="ts">
  import Line3D from './Line.svelte';
  import { Vector3 } from 'three';

  export let p: Vector3;
  export let color: string = 'black'; //color of used lines
  export let showAxisPoints = false;
  export let pointSize = 0.05;

  //points on each axis
  let xAx = new Vector3(p.x, 0, 0);
  let yAx = new Vector3(0, p.y, 0);
  let zAx = new Vector3(0, 0, p.z);

  //points on each plane
  let yP = new Vector3(p.x, 0, p.z);
</script>

<!-- three lines to x,z axis -->
<Line3D points={[p, yP]} {color} isDashed />
<Line3D points={[yP, xAx]} {color} isDashed />
<Line3D points={[yP, zAx]} {color} isDashed />

<!-- line to z axis -->
<Line3D points={[p, yAx]} {color} isDashed />

<!-- points on axis -->
{#if showAxisPoints}
  <!-- TODO: add points -->
  <!-- <Point3D position={xAx} {color} size={pointSize} />
  <Point3D position={yAx} {color} size={pointSize} />
  <Point3D position={zAx} {color} size={pointSize} /> -->
{/if}
