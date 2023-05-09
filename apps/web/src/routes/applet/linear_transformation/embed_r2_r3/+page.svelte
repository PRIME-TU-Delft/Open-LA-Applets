<script lang="ts">
  import { Axis2D, Canvas2D, Line2D, Vector2D, Latex2D } from 'p5-components';

  import { Vector2, Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from 'threlte-components';
  import { LatexUI } from 'ui';
  import { PrimeColor } from 'utils/PrimeColors';

  let zoom = 1;

  let e1 = new Vector2(1, 0);
  let e2 = new Vector2(0, 1);

  let e1Length = 1;
  let e2Length = 1;
  let vLength = Math.sqrt(2);

  let v = e1.clone().multiplyScalar(e1Length).add(e2.clone());

  let te1 = new Vector3(0, 0, 1);
  let te2 = new Vector3(1, 0, 0);
  let tv = te1.clone().multiplyScalar(2).add(te2);

  $: {
    // te1.setLength(sliders.x);
    // te2.setLength(sliders.y);
    // v = e2.clone().multiplyScalar(2).add(e1);
    // tv = te2.clone().multiplyScalar(2).add(te1);
  }

  $: {
    te1 = new Vector3(e1.y, 0, e1.x);

    te2 = new Vector3(e2.y, 0, e2.x);
    v = e1.clone().multiplyScalar(e1Length).add(e2);
    tv = te1.clone().multiplyScalar(e1Length).add(te2);
  }
</script>

<div class="wrapper">
  <div class="formula">
    <LatexUI latex={'T(x)=\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{bmatrix} x'} />
  </div>

  <div class="panel">
    <Canvas2D bind:zoom>
      <Axis2D />

      <!-- e1 -->
      <Vector2D bind:direction={e1} length={e2Length} color={PrimeColor.red} draggable>
        <Latex2D latex={'\\vec{e_1}'} offset={new Vector2(0, -0.2)} />
      </Vector2D>

      <!-- e2 -->
      <Vector2D bind:direction={e2} length={e2Length} color={PrimeColor.yellow} draggable>
        <Latex2D latex={'\\vec{e_2}'} offset={new Vector2(-0.2, 0)} />
      </Vector2D>

      <!-- v -->
      <Vector2D direction={v} length={vLength} color={PrimeColor.ultramarine}>
        <Latex2D latex={'\\vec{v}'} offset={new Vector2(0.1, 0.1)} color={PrimeColor.ultramarine} />
      </Vector2D>

      <!-- Helper lines -->
      <Line2D start={e1.clone().multiplyScalar(e1Length)} end={v} width={2} isDashed />
      <Line2D start={e2.clone().multiplyScalar(e2Length)} end={v} width={2} isDashed />
    </Canvas2D>
  </div>

  <div class="panel">
    <Canvas3D --width="100%" zoom={100}>
      <Axis3D showNumbers />

      <!-- e1 & e2 -->
      <Vector3D direction={te1} length={e1Length} color={PrimeColor.red} />
      <Vector3D direction={te2} length={e2Length} color={PrimeColor.yellow} />

      <Latex3D latex={'T(\\vec{e_1})'} position={te1} />
      <!-- <Latex3D latex={'T(\\vec{e_2})'} position={te2} /> -->

      <!-- <Vector3D direction={tv} length={v.length()} color={PrimeColor.ultramarine} /> -->
      <!-- <Latex3D latex={'T(\\vec{v})'} position={tv} color={PrimeColor.ultramarine} /> -->

      <!-- Helper lines -->
      <!-- <Line3D points={[te1, tv]} color="black" isDashed /> -->
      <!-- <Line3D points={[te2.clone().multiplyScalar(2), tv]} color="black" isDashed /> -->
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
