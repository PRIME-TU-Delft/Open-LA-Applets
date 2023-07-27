<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { DoubleSide, Mesh, MeshBasicMaterial, Plane, PlaneGeometry, Vector3 } from 'three';

  import getRandomColor from '$lib/utils/PrimeColors';
  import PlaneSegments from '$lib/utils/Segments';

  export let points: [Vector3, Vector3, Vector3] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1)
  ];
  export let color = getRandomColor();
  export let size = 10;
  export let opacity = 0.8;
  export let planeSegment = PlaneSegments.default();

  const { invalidate } = useThrelte();

  let materials = [new MeshBasicMaterial({ color, transparent: true, opacity, side: DoubleSide })];
</script>

{#key points}
  <T.Mesh
    material={materials}
    on:change={() => {
      invalidate();
    }}
    on:create={({ ref, cleanup }) => {
      const plane = new Plane().setFromCoplanarPoints(points[0], points[1], points[2]);
      plane.coplanarPoint(ref.position);
      ref.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), plane.normal);

      cleanup(() => {
        materials.map((m) => m.dispose());
      });
    }}
  >
    <T.PlaneGeometry
      args={[size, size, planeSegment.segments, 1]}
      on:create={({ ref }) => {
        for (let i = 0; i < planeSegment.segments; i++) {
          if (i % planeSegment.interval == planeSegment.offset) {
            // A rectangle consists of two triangles 6 vertices
            ref.addGroup(i * 6, 6, 0);
          }
        }
      }}
    />
  </T.Mesh>
{/key}
