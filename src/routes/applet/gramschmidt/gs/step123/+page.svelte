<script lang="ts">
  import { Axis3D, Latex3D, Vector3D, Canvas3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import type { Canvas3DProps } from '$lib/threlte-components';
  
  const v1 = new Vector3(-1, 1, 2); // green vector
</script>
  
<Canvas3D 
  splitCanvas3DProps={{ cameraZoom: 15, cameraPosition: new Vector3(5.79, 14.65, 7.2) }}
>
  <Axis3D showNumbers />
  <!-- Lower green vector -->
  <Vector3D direction={v1} color={PrimeColor.darkGreen} length={v1.length()} />
  <Latex3D position={v1} color={PrimeColor.darkGreen} latex={'V1'} />

  <svelte:fragment slot="splitCanvas">
    <Vector3D direction={v1} color={PrimeColor.darkGreen} length={v1.length()} />
    <Latex3D position={v1} color={PrimeColor.darkGreen} latex={'V1'} />
  </svelte:fragment>
</Canvas3D>
