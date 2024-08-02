<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import PlaneSegments from '$lib/utils/Segments';
  import { T } from '@threlte/core';
  import { onDestroy } from 'svelte';
  import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, Vector3 } from 'three';

  type PlaneFromNormalProps = {
    normal: Vector3;
    position?: Vector3;
    color?: string;
    size?: number;
    opacity?: number;
    planeSegment?: PlaneSegments;
  };

  let {
    position = new Vector3(0, 0, 0),
    normal = new Vector3(1, 1, 1),
    color = PrimeColor.getRandomColor(),
    size = 10,
    opacity = 0.8,
    planeSegment = PlaneSegments.default()
  }: PlaneFromNormalProps = $props();

  let materials = [
    new MeshBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      side: DoubleSide
    })
  ];

  let planeNormalMesh = $state<Mesh>();

  $effect(() => {
    normal.clone().normalize();

    planeNormalMesh?.lookAt(position.clone().add(normal));
  });

  onDestroy(() => {
    if (planeNormalMesh) {
      planeNormalMesh.geometry?.dispose();
    }

    materials.map((m) => m.dispose());
  });
</script>

<!-- @component
This component is a 3D plane defined by a normal vector and a position vector.
 -->

<T.Group rotation.x={Math.PI / 2} position={[position.x, position.y, position.z]}>
  <T.Mesh bind:ref={planeNormalMesh} material={materials}>
    <T.PlaneGeometry
      args={[size, size, planeSegment.segments, 1]}
      oncreate={({ ref }: { ref: PlaneGeometry }) => {
        for (let i = 0; i < planeSegment.segments; i++) {
          if (i % planeSegment.interval == planeSegment.offset) {
            // A rectangle consists of two triangles 6 vertices
            ref.addGroup(i * 6, 6, 0);
          }
        }
      }}
    />
  </T.Mesh>
</T.Group>
