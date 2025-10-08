<script lang="ts">
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  let tv1 = new Vector3(0, 0, 1);
  let tv2 = new Vector3(1, 0, 0);
  let tv3 = new Vector3(0, 1, 0);
</script>

<Canvas3D
  cameraZoom={100}
  title={{ en: 'The vectors in 2d and 3d', nl: 'De vectoren in 2D en 3D' }}
>
  <Axis3D showNumbers />

  <!-- e1 & e2 & e3 -->
  <Vector3D direction={tv1} length={1} color={PrimeColor.blue} />
  <Vector3D direction={tv2} length={1} color={PrimeColor.darkGreen} />
  <Vector3D direction={tv3} length={1} color={PrimeColor.raspberry} />

  <Latex3D latex={'\\mathbf{v_1}'} extend={0.2} position={tv1} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathbf{v_2}'} extend={0.2} position={tv2} color={PrimeColor.darkGreen} />
  <Latex3D latex={'\\mathbf{v_3}'} extend={0.2} position={tv3} color={PrimeColor.raspberry} />
</Canvas3D>
