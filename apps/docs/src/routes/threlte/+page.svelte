<script lang="ts">
  import { MeshStandardMaterial, BoxGeometry, Vector3 } from 'three';
  import { Mesh } from '@threlte/core';

  import { Story } from 'ui';
  import { Axis3D, Canvas3D, PlaneFromNormal } from 'threlte-components';
  import { PrimeColor } from 'ui/utils/primeColors';

  let color: string = PrimeColor.red;
</script>

<Story>
  <Canvas3D>
    <!-- Cube -->
    <Mesh
      interactive
      on:pointerenter={() => (color = '#00ff00')}
      on:pointerleave={() => (color = PrimeColor.red)}
      position={{ y: 0.51 }}
      castShadow
      geometry={new BoxGeometry(1, 1, 1)}
      material={new MeshStandardMaterial({ color })}
    />

    <PlaneFromNormal normal={new Vector3(1, 1, 1)} color={PrimeColor.red} />

    <PlaneFromNormal normal={new Vector3(0, 1, 1)} color={PrimeColor.yellow} />

    <Axis3D />
  </Canvas3D>
</Story>
