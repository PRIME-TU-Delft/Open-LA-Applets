<script>
  import { Vector3 } from 'three';
  import { Formula } from 'ui';
  import { Axis3D, Canvas3D, Vector3D } from 'threlte-components';

  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/Slider';

  let sliders = new Sliders().addSlider(3, 1, 4).addSlider(4, 1, 4);

  const v1Dir = new Vector3(2, 0, -1).normalize();

  $: v2Pos = v1Dir.clone().multiplyScalar(sliders.x);
  $: v3Dir = v2Pos.clone().add(new Vector3(0, 1, 0).multiplyScalar(sliders.y));
  $: v3Length = Math.sqrt(sliders.x * sliders.x + sliders.y * sliders.y);
</script>

<Canvas3D floor bind:sliders>
  <Vector3D direction={v1Dir} color={PrimeColor.red} length={sliders.x} />
  <Vector3D
    origin={v2Pos}
    direction={new Vector3(0, 1, 0)}
    color={PrimeColor.yellow}
    length={sliders.y}
  />

  <Vector3D direction={v3Dir} color={PrimeColor.ultramarine} length={v3Length} />

  <!-- Helper vectors -->
  <Vector3D color={PrimeColor.green} length={v2Pos.x} />
  <Vector3D
    direction={new Vector3(0, 0, -1)}
    origin={new Vector3(v2Pos.x, 0, 0)}
    color={PrimeColor.green}
    length={-v2Pos.z}
  />
  <Vector3D
    direction={v1Dir}
    origin={new Vector3(0, sliders.y, 0)}
    color={'black'}
    striped
    length={sliders.x}
  />
  <Vector3D striped origin={new Vector3(0, 0, v2Pos.z)} color="black" length={v2Pos.x} />

  <Axis3D showNumbers />

  <div slot="formulas">
    <Formula color={PrimeColor.red} param={sliders.x} formula="length: _" />

    <Formula color={PrimeColor.yellow} param={sliders.y} formula="length: _" />

    <Formula
      color={PrimeColor.ultramarine}
      param={parseFloat(v3Length.toFixed(2))}
      formula="sqrt({sliders.x}^2 + {sliders.y}^2) = _"
    />
  </div>
</Canvas3D>
