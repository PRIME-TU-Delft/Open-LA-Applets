<script lang="ts">
  import { CircleGeometry, MeshStandardMaterial, BoxGeometry, DoubleSide } from 'three';
  import { DEG2RAD } from 'three/src/math/MathUtils';
  import {
    AmbientLight,
    Canvas,
    Group,
    Mesh,
    OrbitControls,
    OrthographicCamera,
    PerspectiveCamera,
    useThrelte
  } from '@threlte/core';
  import { spring } from 'svelte/motion';
  import { Story } from 'ui';
  import { Axis3D } from 'threlte-components';

  const scale = spring(1);

  let frameloop: 'demand' | 'always' | 'never' = 'never';
</script>

<Story>
  <Canvas {frameloop}>
    <PerspectiveCamera position={{ x: 3, y: 3, z: 3 }}>
      <OrbitControls
        maxPolarAngle={DEG2RAD * 120}
        autoRotate={true}
        enableZoom={false}
        target={{ y: 0.5 }}
      />
    </PerspectiveCamera>

    <AmbientLight intensity={1} />

    <!-- Cube -->
    <Group scale={$scale}>
      <Mesh
        interactive
        on:pointerenter={() => ($scale = 2)}
        on:pointerleave={() => ($scale = 1)}
        position={{ y: 0.5 }}
        castShadow
        geometry={new BoxGeometry(1, 1, 1)}
        material={new MeshStandardMaterial({ color: '#333333' })}
      />
    </Group>

    <!-- Floor -->
    <Mesh
      receiveShadow
      rotation={{ x: -90 * (Math.PI / 180) }}
      geometry={new CircleGeometry(3, 72)}
      material={new MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
    />

    <Axis3D />
  </Canvas>
</Story>
