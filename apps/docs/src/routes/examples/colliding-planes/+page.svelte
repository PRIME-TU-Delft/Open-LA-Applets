<script lang="ts">
  import { Story } from 'ui';

  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, Vector3D, AutoPlane } from 'visuals-3d';

  import { PrimeColor } from 'ui/utils/primeColors';
  import Slider from 'ui/utils/slider';

  let sliders = [Slider.set(0).red(), Slider.set(0.5).yellow(), Slider.set(1).green()] as const;
</script>

<Story title="Work in Progress">
  <Canvas3D
    --height="100%"
    sliders="{sliders}"
    let:sliderValues="{[x, y, z]}"
    title="Two planes with a line of intersection."
  >
    <Vector3D
      color="{PrimeColor.ultramarine}"
      length="{10}"
      origin="{new Vector3(0, -3.5, 3.5)}"
      direction="{new Vector3(0, 1, -1)}"
      coneHeight="{0}"
    />

    <AutoPlane normals="{[new Vector3(x, 1, 1), new Vector3(y, 1, 1), new Vector3(z, 1, 1)]}" />

    <Axis3D />
  </Canvas3D>
</Story>
