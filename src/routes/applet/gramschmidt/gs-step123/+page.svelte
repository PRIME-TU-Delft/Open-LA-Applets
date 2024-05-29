<script lang="ts">
  import { Axis3D, Latex3D, Vector3D, Canvas3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  
  const v1 = new Vector3(-1, 1, 2); // green vector
</script>
  
<Canvas3D 
  splitCanvas3DProps={{ cameraZoom: 15, cameraPosition: new Vector3(5.79, 14.65, 7.2) }}
>
  <Axis3D showNumbers />
  <!-- Lower green vector -->
  <Vector3D direction={v1} color={PrimeColor.darkGreen} length={v1.length()} />
  <Latex3D position={v1} color={PrimeColor.darkGreen} latex={'V1'} />

  <svelte:fragment slot="splitCanvas3d">
    <Vector3D direction={v1} color={PrimeColor.darkGreen} length={v1.length()} />
    <Latex3D position={v1} color={PrimeColor.darkGreen} latex={'V1'} />
    <Axis3D showNumbers />
  </svelte:fragment>
</Canvas3D>
