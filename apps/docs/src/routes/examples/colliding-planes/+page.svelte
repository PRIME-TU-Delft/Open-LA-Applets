<script lang="ts">
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Vector3D, AutoPlane } from 'visuals-3d';

  import { Story, Formula } from 'ui';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/slider';

  let sliders = new Sliders().addSlider(0).addSlider(0.5).addSlider(1);
</script>

<Story title="Work in Progress">
  <Canvas3D --height="100%" bind:sliders title="Two planes with a line of intersection.">
    {#if !sliders.allEqual}
      <Vector3D
        color={PrimeColor.ultramarine}
        length={11.5}
        origin={new Vector3(0, -4, 4)}
        direction={new Vector3(0, 1, -1)}
        coneHeight={0.01}
      />
    {/if}

    <AutoPlane
      normals={[
        new Vector3(sliders.x, 1, 1),
        new Vector3(sliders.y, 1, 1),
        new Vector3(sliders.z, 1, 1)
      ]}
    />

    <!-- TODO: make this more developer friendly -->
    <div slot="formulas">
      <Formula color={PrimeColor.red} param={sliders.x} formula="_x + 1y + 1z = 0" />

      <Formula color={PrimeColor.yellow} param={sliders.y} formula="_x + 1y + 1z = 0" />

      <Formula color={PrimeColor.green} param={sliders.z} formula="_x + 1y + 1z = 0" />
    </div>
    <Axis3D />
  </Canvas3D>
</Story>
