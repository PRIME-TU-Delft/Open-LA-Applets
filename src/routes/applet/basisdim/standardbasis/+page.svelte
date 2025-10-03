<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
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

<Canvas2D
  splitCanvas3DProps={{ cameraZoom: 100 }}
  title={{ en: 'The standard bases in 2d and 3d', nl: 'De standaardbasissen in 2D en 3D' }}
>
  <!-- e1 -->
  <Vector2D direction={e1} length={e1Length} color={PrimeColor.blue}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{e_1}'}
        offset={new Vector2(-0.3, 0.4)}
        position={endPoint}
        color={PrimeColor.blue}
      />
    {/snippet}
  </Vector2D>

  <!-- e2 -->
  <Vector2D direction={e2} length={e2Length} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{e_2}'}
        offset={new Vector2(0.2, -0.1)}
        position={endPoint}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>

  {#snippet splitCanvas3DChildren()}
    <Axis3D showNumbers />

    <!-- e1 & e2 & e3 -->
    <Vector3D direction={te1} length={te1.length()} color={PrimeColor.blue} />
    <Vector3D direction={te2} length={te2.length()} color={PrimeColor.darkGreen} />
    <Vector3D direction={te3} length={te3.length()} color={PrimeColor.raspberry} />

    <Latex3D latex={'\\mathbf{e_1}'} position={te1} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{e_2}'} position={te2} color={PrimeColor.darkGreen} />
    <Latex3D latex={'\\mathbf{e_3}'} position={te3} color={PrimeColor.raspberry} />
  {/snippet}
</Canvas2D>
