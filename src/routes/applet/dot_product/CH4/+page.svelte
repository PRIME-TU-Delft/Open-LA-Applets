<script lang="ts">
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const hAtoms = [
    new Vector3(1, 1, 1),
    new Vector3(1, -1, -1),
    new Vector3(-1, 1, -1),
    new Vector3(-1, -1, 1)
  ];
</script>

<Canvas3D cameraZoom={100} cameraPosition={new Vector3(8.92, 14.8, -1.1)}>
  <Point3D position={new Vector3()} size={0.25} color="rgb(47,73,74)" />
  <Latex3D latex={'\\mathbf{C}'} hasBackground />

  {#each hAtoms as atom}
    <Point3D position={atom} size={0.25} color="rgb(108,139,139)" />
    <Vector3D direction={atom} noNormalise color={PrimeColor.black} hideHead />
    <Latex3D latex={'\\mathbf{H}'} position={atom} hasBackground />
  {/each}

  <Axis3D showNumbers hideOrigin />
</Canvas3D>
