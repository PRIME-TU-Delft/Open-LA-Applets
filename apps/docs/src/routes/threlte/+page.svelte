<script lang="ts">
  import { MeshStandardMaterial, BoxGeometry, Vector3 } from 'three';
  import { Mesh } from '@threlte/core';

  import { Story } from 'ui';
  import { Axis3D, Canvas3D, AutoPlane } from 'threlte-components';
  import { PrimeColor } from 'ui/utils/primeColors';
  import { Sliders } from 'ui/utils/slider';

  let sliders = new Sliders().addSlider(0).addSlider(0.5).addSlider(1);

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

    <AutoPlane
      normals={[
        new Vector3(sliders.x, 1, 1),
        new Vector3(sliders.y, 1, 1),
        new Vector3(sliders.z, 1, 1)
      ]}
    />

    <Axis3D />
  </Canvas3D>
</Story>
