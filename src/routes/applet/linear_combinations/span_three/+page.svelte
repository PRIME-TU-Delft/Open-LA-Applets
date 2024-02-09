<script>
  import { Axis3D, Canvas3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import CubePlaneLine from './CubePlaneLine.svelte';

  const u = new Vector3(1, 3, 3); // Direction of vector u
  const v = new Vector3(3, 2, -3); // Direction of vector v
  const w = new Vector3(1, -2, 0); // Direction of vector w

  let controls = Controls.addToggle(true, '\\mathbf{u}')
    .addToggle(true, '\\mathbf{v}')
    .addToggle(true, '\\mathbf{w}');
</script>

<Canvas3D bind:controls>
  <CubePlaneLine toggles={controls} uvw={[u, v, w]} />

  {#if controls[0]}
    <Vector3D direction={u} length={u.length()} color={PrimeColor.red} />
    <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.red} />
  {/if}
  {#if controls[1]}
    <Vector3D direction={v} length={v.length()} color={PrimeColor.blue} />
    <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.blue} />
  {/if}
  {#if controls[2]}
    <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
    <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.darkGreen} />
  {/if}

  <Axis3D />
</Canvas3D>
