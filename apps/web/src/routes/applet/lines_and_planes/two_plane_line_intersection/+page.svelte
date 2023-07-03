<script lang="ts">
  import { Vector3 } from 'three';

  import { Canvas3D, AutoPlane, Axis3D, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { LatexUI } from 'ui';

  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/Slider';

  let sliders = new Sliders().addSlider(0).addSlider(1);
</script>

<Canvas3D bind:sliders title="Two planes with a line of intersection.">
  <AutoPlane values={sliders.values} let:value let:planeSegment let:color>
    <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
  </AutoPlane>

  {#if !sliders.allEqual}
    <Vector3D
      color={PrimeColor.ultramarine}
      length={11.5}
      origin={new Vector3(0, -4, 4)}
      direction={new Vector3(0, 1, -1)}
      hideHead
    />
  {/if}

  <Axis3D showNumbers />

  <div slot="formulas">
    <LatexUI params={[sliders.x]} colors={[PrimeColor.red]} latex={'\\$0x + 1y + 1z = 0'} />

    <LatexUI params={[sliders.y]} colors={[PrimeColor.yellow]} latex={'\\$0x + 1y + 1z = 0'} />
  </div>
</Canvas3D>
