<script lang="ts">
  import { CircleGeometry, MeshStandardMaterial, BoxGeometry, DoubleSide } from 'three';
  import { Group, Mesh } from '@threlte/core';
  import { spring } from 'svelte/motion';
  import { Story } from 'ui';
  import { Axis3D, Canvas3D } from 'threlte-components';

  const scale = spring(1);
</script>

<Story>
  <Canvas3D floor>
    <!-- Cube -->
    <Group scale={$scale}>
      <Mesh
        interactive
        on:pointerenter={() => ($scale = 2)}
        on:pointerleave={() => ($scale = 1)}
        position={{ y: 0.51 }}
        castShadow
        geometry={new BoxGeometry(1, 1, 1)}
        material={new MeshStandardMaterial({ color: '#333333' })}
      />
    </Group>

    <Axis3D />
  </Canvas3D>
</Story>
