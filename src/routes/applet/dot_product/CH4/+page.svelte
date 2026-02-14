<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const hAtoms = [
    new MathVector3(1, 1, 1),
    new MathVector3(-1, 1, -1),
    new MathVector3(-1, -1, 1),
    new MathVector3(1, -1, -1)
  ];
</script>

<Canvas3D cameraZoom={100} cameraPosition={new MathVector3(-1.1, 8.92, 14.8)}>
  <!-- C atom -->
  <Point3D position={new MathVector3(0, 0, 0)} size={0.25} color="rgb(47,73,74)" />
  <Latex3D latex={'\\mathbf{C}'} hasBackground />

  {#each hAtoms as atom (atom.x + '_' + atom.y + '_' + atom.z)}
    <!-- H atoms -->
    <Point3D position={atom} size={0.25} color="#ccc" />
    <Vector3D direction={atom} noNormalise color={PrimeColor.black} hideHead />
    <Latex3D latex={'\\mathbf{H}'} position={atom} hasBackground />
  {/each}

  <Axis3D showNumbers hideOrigin />
</Canvas3D>
