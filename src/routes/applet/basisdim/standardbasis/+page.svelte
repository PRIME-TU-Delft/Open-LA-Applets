<script lang="ts">
  import { Axis2D, Canvas2D, Line2D, Vector2D, Latex2D } from '$lib/d3-components';

  import { Vector2, Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import LatexUI from '$lib/components/Latex.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let zoom = 1;

  let e1 = new Vector2(1, 0);
  let e2 = new Vector2(0, 1);

  let e1Length = 1
  let e2Length = 1

  let te1 = new Vector3(0, 0, 1);
  let te2 = new Vector3(1, 0, 0);
  let te3 = new Vector3(0, 1, 0);

</script>

<div class="wrapper">

  <div class="panel">
    <Canvas2D>

      <!-- e1 -->
      <Vector2D direction={e1} length={e1Length} color={PrimeColor.ultramarine} let:endPoint>
        <Latex2D latex={'\\mathbf{e_1}'} offset={new Vector2(-0.3, 0.4)} position={endPoint}/>
      </Vector2D>

      <!-- e2 -->
      <Vector2D direction={e2} length={e2Length} color={PrimeColor.green} let:endPoint>
        <Latex2D latex={'\\mathbf{e_2}'} offset={new Vector2(0.2, -0.1)} position={endPoint}/>
      </Vector2D>
    </Canvas2D>
  </div>

  <div class="panel">
    <Canvas3D --width="100%" zoom={100}>
      <Axis3D showNumbers />

      <!-- e1 & e2 & e3 -->
      <Vector3D direction={te1} length={te1.length()} color={PrimeColor.ultramarine} />
      <Vector3D direction={te2} length={te2.length()} color={PrimeColor.green} />
      <Vector3D direction={te3} length={te3.length()} color={PrimeColor.red} />

      <Latex3D latex={'T(\\mathbf{e_1})'} position={te1} />
      <Latex3D latex={'T(\\mathbf{e_2})'} position={te2} />
      <Latex3D latex={'T(\\mathbf{e_3})'} position={te3} />
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