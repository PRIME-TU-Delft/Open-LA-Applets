<script lang="ts">
  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, PlaneFromNormal } from 'visuals-3d';

  import Slider from 'ui/utils/slider';
  import { PrimeColor } from 'ui/utils/primeColors';
  import { PlaneSegments } from 'visuals-3d/utils/Segments';

  const normal = new Vector3(1, 3, 1).normalize();
  const sliders = [new Slider(0, -5, 5, 1).red(), new Slider(1, -5, 5, 1).yellow()];
</script>

<Canvas3D {sliders} let:sliderValues={[x, y]} title="Two planes without a common point in common.">
  <!-- TODO: make colliding planes auto detected -->
  {#if y !== x}
    <!-- Planes are not striped -->
    <PlaneFromNormal point={new Vector3(0, x, 0)} {normal} color={PrimeColor.red} />

    <PlaneFromNormal point={new Vector3(0, y, 0)} {normal} color={PrimeColor.yellow} />
  {:else}
    <!-- Planes are striped to show collision -->
    <PlaneFromNormal
      planeSegment={new PlaneSegments(32, 0, 2)}
      point={new Vector3(0, x, 0)}
      {normal}
      color={PrimeColor.red}
    />

    <PlaneFromNormal
      planeSegment={new PlaneSegments(32, 1, 2)}
      point={new Vector3(0, y, 0)}
      {normal}
      color={PrimeColor.yellow}
    />
  {/if}

  <Axis3D />
</Canvas3D>
