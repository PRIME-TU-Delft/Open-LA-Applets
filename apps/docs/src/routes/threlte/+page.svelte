<script lang="ts">
  import { Vector3 } from 'three';

  import { Story, Formula } from 'ui';
  import { Axis3D, Canvas3D, PlaneFromNormal, Vector3D } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/slider';
  import { Label } from 'utils/Label';

  let sliders = new Sliders().addSlider(0, 0, 2).addSlider(0.5, 0, 2).addSlider(1, 0, 2);
</script>

<Story>
  <Canvas3D bind:sliders>
    <Vector3D
      color={PrimeColor.green}
      direction={new Vector3(sliders.x, sliders.y, sliders.z)}
      length={3}
      label={new Label('hello', 'black')}
    />
    <PlaneFromNormal color={PrimeColor.red} normal={new Vector3(sliders.x, 1, 1)} />

    <Axis3D />

    <div slot="formulas">
      <Formula color={PrimeColor.red} param={sliders.x} formula="_x + 1y + 1z = 0" />

      <Formula color={PrimeColor.yellow} param={sliders.y} formula="_x + 1y + 1z = 0" />

      <Formula color={PrimeColor.green} param={sliders.z} formula="_x + 1y + 1z = 0" />
    </div>
  </Canvas3D>
</Story>
