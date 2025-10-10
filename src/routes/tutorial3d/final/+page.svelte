<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';

  let v1 = new Draggable(new Vector2(1, 0), PrimeColor.blue, '\\mathbf{v_1}');
  let v2 = new Draggable(new Vector2(0, 1), PrimeColor.darkGreen, '\\mathbf{v_2}');

  let tv1 = $derived(new Vector3(v1.position.y, 0, v1.position.x));
  let tv2 = $derived(new Vector3(v2.position.y, 0, v2.position.x));
  let tv3 = new Vector3(0, 1, 0);
</script>

<Canvas3D
  cameraZoom={100}
  splitCanvas2DProps={{ cameraZoom: 3, draggables: [v1, v2] }}
  title="applets.tutorials.vectors_in_2d_and_3d"
>
  <Axis3D showNumbers />

  <!-- e1 & e2 & e3 -->
  <Vector3D direction={tv1} length={1} color={PrimeColor.blue} />
  <Vector3D direction={tv2} length={1} color={PrimeColor.darkGreen} />
  <Vector3D direction={tv3} length={1} color={PrimeColor.raspberry} />

  <Latex3D
    latex={'\\mathbf{v_1}'}
    position={tv1.normalize().multiplyScalar(1.2)}
    color={PrimeColor.blue}
  />
  <Latex3D
    latex={'\\mathbf{v_2}'}
    position={tv2.normalize().multiplyScalar(1.2)}
    color={PrimeColor.darkGreen}
  />
  <Latex3D
    latex={'\\mathbf{v_3}'}
    position={tv3.normalize().multiplyScalar(1.2)}
    color={PrimeColor.raspberry}
  />

  {#snippet splitCanvas2DChildren()}
    <!-- v1, v2 -->
    <Vector2D direction={v1.position} length={1} color={PrimeColor.blue} />
    <Vector2D direction={v2.position} length={1} color={PrimeColor.darkGreen} />
  {/snippet}
</Canvas3D>
