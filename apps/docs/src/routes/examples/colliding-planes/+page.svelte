<script lang="ts">
  import { Story } from 'ui';

  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, Vector3D, PlaneFromNormal } from 'visuals-3d';

  import { PrimeColor } from 'ui/utils/primeColors';
  import Slider from 'ui/utils/slider';
  import { PlaneSegments } from 'visuals-3d/utils/Segments';

  let sliders = [new Slider(0, -1, 1, 0.2).red(), new Slider(1, -1, 1, 0.2).yellow()] as const;
</script>

<Story title="Work in Progress">
  <Canvas3D
    --height="100%"
    sliders="{sliders}"
    let:sliderValues="{[x, y]}"
    title="Two planes with a line of intersection."
  >
    <Vector3D
      color="{PrimeColor.ultramarine}"
      length="{10}"
      origin="{new Vector3(0, -3.5, 3.5)}"
      direction="{new Vector3(0, 1, -1)}"
      coneHeight="{0}"
    />

    {#if y !== x}
      <!-- Planes are not striped -->
      <PlaneFromNormal normal="{new Vector3(x, 1, 1)}" color="{PrimeColor.red}" />
      <PlaneFromNormal normal="{new Vector3(y, 1, 1)}" color="{PrimeColor.yellow}" />
    {:else}
      <!-- Planes are striped to show collision -->
      <PlaneFromNormal
        planeSegment="{new PlaneSegments(32, 0, 2)}"
        normal="{new Vector3(x, 1, 1)}"
        color="{PrimeColor.red}"
      />

      <PlaneFromNormal
        planeSegment="{new PlaneSegments(32, 1, 2)}"
        normal="{new Vector3(y, 1, 1)}"
        color="{PrimeColor.yellow}"
      />
    {/if}

    <Axis3D />
  </Canvas3D>
</Story>
