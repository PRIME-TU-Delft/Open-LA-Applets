<script lang="ts">
  import { T } from '@threlte/core';
  import { DoubleSide, Mesh, MeshBasicMaterial, Plane, Vector3 } from 'three';

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import PlaneSegments from '$lib/utils/Segments';
  import { onDestroy } from 'svelte';

  type PlaneFromPointsProps = {
    points: [Vector3, Vector3, Vector3];
    origin?: Vector3;
    color?: string;
    size?: number;
    opacity?: number;
    planeSegment?: PlaneSegments;
  };

  let {
    points = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)],
    origin = new Vector3(),
    color = PrimeColor.getRandomColor(),
    size = 10,
    opacity = 0.8,
    planeSegment = PlaneSegments.default()
  }: PlaneFromPointsProps = $props();

  let planeMesh = $state<Mesh>();

  let materials = [new MeshBasicMaterial({ color, transparent: true, opacity, side: DoubleSide })];

  $effect(() => {
    if (!planeMesh) return;

    const plane = new Plane().setFromCoplanarPoints(points[0], points[1], points[2]);
    plane.coplanarPoint(planeMesh.position);
    planeMesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), plane.normal);

    for (let i = 0; i < planeSegment.segments; i++) {
      if (i % planeSegment.interval == planeSegment.offset) {
        // A rectangle consists of two triangles 6 vertices
        planeMesh.geometry.addGroup(i * 6, 6, 0);
      }
    }
  });

  onDestroy(() => {
    materials.map((m) => m.dispose());
  });
</script>

<T.Group position.x={origin.x} position.y={origin.y} position.z={origin.z}>
  <T.Mesh material={materials} bind:ref={planeMesh}>
    <T.PlaneGeometry args={[size, size, planeSegment.segments, 1]} />
  </T.Mesh>
</T.Group>
