<script lang="ts">
  import { Matrix3, Vector3 } from 'three';
  import { Axis3D, Canvas3D, Parallellepipedum3D, Vector3D } from 'threlte-components';
  import { LatexUI } from 'ui';
  import { matrix } from 'utils/LatexFormat';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/Slider';

  let p1 = new Vector3(0, 0, 1);
  let p2 = new Vector3(1, 0, 0);
  let p3 = new Vector3(1, 2, 1);
  const m1 = new Matrix3();
  let determinant: number = m1.extractBasis(p1.clone(), p2.clone(), p3.clone()).determinant();

  let sliders = new Sliders().addSlider(3, 2, 5).addSlider(3, 2, 5).addSlider(3, 2, 5);

  $: {
    p1.setLength(sliders.x);
    p1 = p1.clone();
  }

  $: {
    p2.setLength(sliders.y);
    p2 = p2.clone();
  }
  $: {
    p3.setLength(sliders.z);
    p3 = p3.clone();
  }

  $: {
    m1.fromArray([p1.x, p2.x, p3.x, p1.y, p2.y, p3.y, p1.z, p2.z, p3.z]);
    determinant = m1.determinant();
  }

  const defaultVectors = [p1.clone(), p2.clone(), p3.clone()] as [Vector3, Vector3, Vector3];
  defaultVectors[0].setLength(sliders.x - 0.01);
  defaultVectors[1].setLength(sliders.y - 0.01);
  defaultVectors[2].setLength(sliders.z - 0.01);
</script>

<Canvas3D bind:sliders enablePan>
  <Vector3D radius={0.1} direction={p1} length={p1.length()} color={PrimeColor.red} />
  <Vector3D radius={0.1} direction={p2} length={p2.length()} color={PrimeColor.yellow} />
  <Vector3D radius={0.1} direction={p3} length={p3.length()} color={PrimeColor.green} />

  <Parallellepipedum3D
    origin={new Vector3(0.01, 0.01, 0.01)}
    points={[p1, p2, p3]}
    color={PrimeColor.red}
    hasPoints
  />

  {#if !sliders.atDefault}
    <Parallellepipedum3D points={defaultVectors} color={PrimeColor.ultramarine} />
  {/if}

  <div slot="formulas">
    {#key p1}
      <LatexUI
        colors={[PrimeColor.red, PrimeColor.yellow]}
        latex={'det(' +
          matrix([
            [p1.z.toFixed(2), '0', p3.z.toFixed(2)],
            ['0', p2.x.toFixed(2), p3.x.toFixed(2)],
            ['0', '0', p3.y.toFixed(2)]
          ]) +
          ') =' +
          determinant.toFixed(2)}
      />
    {/key}
  </div>

  <Axis3D />
</Canvas3D>
