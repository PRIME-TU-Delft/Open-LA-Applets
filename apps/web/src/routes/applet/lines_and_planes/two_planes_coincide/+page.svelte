<script lang="ts">
  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, PlaneFromNormal } from 'visuals-3d';

  import { PrimeColor } from 'ui/utils/primeColors';
  import Slider from 'ui/utils/slider';
  import { PlaneSegments } from 'visuals-3d/utils/Segments';

  const normal = new Vector3(1, 3, 1).normalize();

  let sliders = [new Slider(0, -5, 5, 1).red(), new Slider(0, -5, 5, 1).yellow()] as const;
</script>

<Canvas3D sliders="{sliders}" let:sliderValues="{[x, y]}" title="Two planes that coincide.">
  {#if y !== x}
    <!-- Planes are not striped -->
    <PlaneFromNormal point="{new Vector3(0, x, 0)}" normal="{normal}" color="{PrimeColor.red}" />

    <PlaneFromNormal point="{new Vector3(0, y, 0)}" normal="{normal}" color="{PrimeColor.yellow}" />
  {:else}
    <!-- Planes are striped to show collision -->
    <PlaneFromNormal
      planeSegment="{new PlaneSegments(32, 0, 2)}"
      point="{new Vector3(0, x, 0)}"
      normal="{normal}"
      color="{PrimeColor.red}"
    />

    <PlaneFromNormal
      planeSegment="{new PlaneSegments(32, 1, 2)}"
      point="{new Vector3(0, y, 0)}"
      normal="{normal}"
      color="{PrimeColor.yellow}"
    />
  {/if}

  <Axis3D />
</Canvas3D>
