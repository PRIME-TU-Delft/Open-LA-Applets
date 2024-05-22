<script lang="ts">
  /**
   * This component is defined by a normal vector and a center position.
   */

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import PlaneSegments from '$lib/utils/Segments';
  import { T, useThrelte } from '@threlte/core';

  import { DoubleSide, MeshBasicMaterial, Quaternion, Vector3 } from 'three';

  export let position: Vector3 = new Vector3(0, 0, 0);
  export let normal: Vector3 = new Vector3(1, 1, 1);
  export let color = PrimeColor.getRandomColor();
  export let size = 10;
  export let opacity = 0.8;
  export let planeSegment = PlaneSegments.default();

  const { invalidate } = useThrelte();
  let materials = [
    new MeshBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      side: DoubleSide
    })
  ];

  $: normal = normal.clone().normalize();
</script>

{#key normal.clone().add(position)}
  <T.Mesh
    material={materials}
    position={[position.x, position.y, position.z]}
    on:change={() => {
      invalidate();
    }}
    on:create={({ ref, cleanup }) => {
      ref.setRotationFromQuaternion(
        new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal)
      );

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
