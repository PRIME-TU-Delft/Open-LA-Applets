<script lang="ts">
  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, AutoPlane } from 'visuals-3d';

  import { Sliders } from 'utils/Slider';

  const normal = new Vector3(1, 3, 1).normalize();
  let sliders = new Sliders().addSlider(0, -5, 5, 1).addSlider(1, -5, 5, 1);
</script>

<Canvas3D bind:sliders title="Two planes without a point in common.">
  <AutoPlane
    normals={[normal]}
    points={[new Vector3(0, sliders.x, 0), new Vector3(0, sliders.y, 0)]}
  />

  <Axis3D />
</Canvas3D>
