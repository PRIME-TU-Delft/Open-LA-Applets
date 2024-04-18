<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  let controls = Controls.addSlider(0, -10, 0, 0.5).addSlider(1, 1, 10, 0.5);
  let formulas: Formula[] = [];

  function setFormulas(x: number, y: number) {
    const f1 = new Formula('\\$x + 1y + 1z = 0', x, PrimeColor.raspberry);
    const f2 = new Formula('\\$x + 1y + 1z = 0', y, PrimeColor.yellow);

    return [f1, f2];
  }

  $: formulas = setFormulas(controls[0], controls[1]);
</script>

<Canvas3D bind:controls {formulas} title="Two planes with a line of intersection.">
  <AutoPlane values={[controls[0], controls[1]]} let:value let:planeSegment let:color>
    <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
  </AutoPlane>

  {#if !controls.allSlidersEqualValue}
    <Vector3D
      color={PrimeColor.blue}
      length={11.5}
      origin={new Vector3(0, -4, 4)}
      direction={new Vector3(0, 1, -1)}
      radius={0.2}
      hideHead
      alwaysOnTop
    />
  {/if}

  <Axis3D />
</Canvas3D>
