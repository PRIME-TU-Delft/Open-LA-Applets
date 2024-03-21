<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import { Axis3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';

  let e1 = new Vector2(1, 0);
  let e2 = new Vector2(0, 1);

  let e1Length = 1;
  let e2Length = 1;

  let te1 = new Vector3(0, 0, 1);
  let te2 = new Vector3(1, 0, 0);
  let te3 = new Vector3(0, 1, 0);
</script>

<Canvas2D splitCanvas3DProps={{ cameraZoom: 100 }}>
  <!-- e1 -->
  <Vector2D direction={e1} length={e1Length} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      latex={'\\mathbf{e_1}'}
      offset={new Vector2(-0.3, 0.4)}
      position={endPoint}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- e2 -->
  <Vector2D direction={e2} length={e2Length} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      latex={'\\mathbf{e_2}'}
      offset={new Vector2(0.2, -0.1)}
      position={endPoint}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <svelte:fragment slot="splitCanvas3d">
    <Axis3D showNumbers />

    <!-- e1 & e2 & e3 -->
    <Vector3D direction={te1} length={te1.length()} color={PrimeColor.blue} />
    <Vector3D direction={te2} length={te2.length()} color={PrimeColor.darkGreen} />
    <Vector3D direction={te3} length={te3.length()} color={PrimeColor.raspberry} />

    <Latex3D latex={'\\mathbf{e_1}'} position={te1} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{e_2}'} position={te2} color={PrimeColor.darkGreen} />
    <Latex3D latex={'\\mathbf{e_3}'} position={te3} color={PrimeColor.raspberry} />
  </svelte:fragment>
</Canvas2D>
