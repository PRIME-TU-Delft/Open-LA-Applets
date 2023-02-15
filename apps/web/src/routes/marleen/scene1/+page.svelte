<script lang="ts">
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Parallellepipedum3D, Vector3D } from 'threlte-components';
  import { LatexUI } from 'ui';
  import { matrix } from 'utils/LatexFormat';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/Slider';

  const p1 = new Vector3(0, 0, 1);
  p1.setLength(3);

  const p2 = new Vector3(1, 0, 0);
  p2.setLength(3);

  const p3 = new Vector3(1, 2, 1);
  p3.setLength(3);

  let sliders = new Sliders().addSlider(1, 0, 2).addSlider(0, 0, 2).addSlider(0, 0, 2);
</script>

<Canvas3D bind:sliders enablePan>
  <Vector3D direction={p1} length={3} color={PrimeColor.red} />
  <Vector3D direction={p2} length={3} color={PrimeColor.yellow} />
  <Vector3D direction={p3} length={3} color={PrimeColor.green} />

  <Parallellepipedum3D
    origin={new Vector3(sliders.x, sliders.y - 0.01, sliders.z)}
    points={[p1, p2, p3]}
    color={PrimeColor.red}
    hasPoints
  />

  <Parallellepipedum3D points={[p1, p2, p3]} color={PrimeColor.ultramarine} />

  <div slot="formulas">
    <LatexUI
      colors={[PrimeColor.red, PrimeColor.yellow]}
      latex={'det(' +
        matrix([
          [1, 0, 1],
          [0, 1, 1],
          [0, 0, 2]
        ]) +
        ') = 2'}
    />
  </div>

  <Axis3D />
</Canvas3D>
