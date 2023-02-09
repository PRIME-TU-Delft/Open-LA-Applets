<script lang="ts">
  import { Axis2D, Canvas2D, Line2D, Vector2D, Latex2D } from 'p5-components';

  import { GridType } from 'p5-components/components/Grids';
  import { Vector2, Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Vector3D } from 'threlte-components';
  import { LatexUI } from 'ui';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders } from 'utils/Slider';

  let zoom = 1;

  const e1 = new Vector2(1, 0);
  const e2 = new Vector2(0, 1);
  let v = e1.clone().multiplyScalar(2).add(e2);

  const te1 = new Vector3(0, 0, 1);
  const te2 = new Vector3(1, 0, 0);
  let tv = te1.clone().multiplyScalar(2).add(te2);

  let sliders = new Sliders().addSlider(1, 1, 2).addSlider(1, 1, 2);

  $: {
    e1.setLength(sliders.x);
    e2.setLength(sliders.y);

    v = e2.clone().multiplyScalar(2).add(e1);
    tv = te2.clone().multiplyScalar(2).add(te1);
  }
</script>

<div class="wrapper">
  <div class="formula">
    <LatexUI latex={'T(x)=\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{bmatrix} x'} />
  </div>

  <div class="panel">
    <Canvas2D bind:sliders bind:zoom>
      <Axis2D />

      <!-- e1 -->
      <Vector2D direction={e1} length={sliders.x} color={PrimeColor.red}>
        <Latex2D latex={'\\vec{e_1}'} offset={new Vector2(0, -0.2)} />
      </Vector2D>

      <!-- e2 -->
      <Vector2D direction={e2} length={sliders.y} color={PrimeColor.yellow}>
        <Latex2D latex={'\\vec{e_2}'} offset={new Vector2(-0.2, 0)} />
      </Vector2D>

      <!-- v -->
      <Vector2D direction={v} length={v.length()} color={PrimeColor.ultramarine}>
        <Latex2D latex={'\\vec{v}'} offset={new Vector2(0.1, 0.1)} color={PrimeColor.ultramarine} />
      </Vector2D>
    </Canvas2D>
  </div>

  <div class="panel">
    <Canvas3D bind:sliders --width="100%" zoom={100}>
      <Axis3D showNumbers />

      <!-- e1 -->
      <Vector3D direction={te1} length={sliders.x} color={PrimeColor.red} />
      <Latex3D latex={'T(\\vec{e1})'} position={te1} />

      <!-- e0 -->
      <Vector3D direction={te2} length={sliders.y} color={PrimeColor.yellow} />
      <Latex3D latex={'T(\\vec{e2})'} position={te2} />

      <Vector3D direction={tv} length={v.length()} color={PrimeColor.ultramarine} />
      <Latex3D latex={'T(\\vec{v})'} position={tv} color={PrimeColor.ultramarine} />
    </Canvas3D>
  </div>
</div>

<style>
  .formula {
    position: absolute;
    left: 50%;
    top: 30%;
    scale: 1.5;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  .wrapper {
    display: flex;
    gap: 1rem;
    height: 100%;
  }

  .panel {
    width: 50vw;
    height: 100%;
  }
</style>
