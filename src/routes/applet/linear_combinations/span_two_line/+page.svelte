<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';

  let controls = Controls.addSlider(3, -5, 5, 0.5, PrimeColor.raspberry).addSlider(
    5,
    -5,
    5,
    0.5,
    PrimeColor.yellow
  );

  $: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  $: u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
  $: lineDir = v.clone().normalize().multiplyScalar(10);

  $: vLen = Math.abs(controls[0]) < 1 ? (controls[0] < 0 ? -1 : 1) : controls[0];
  $: uLen = Math.abs(controls[1]) < 1 ? (controls[1] < 0 ? -1 : 1) : controls[1];
</script>

<Canvas3D bind:controls>
  <!-- If u & v are on the same quadrant and v is SMALLER OR EQUAL TO than u -> u on top -->
  {#if controls[0] * controls[1] >= 0 && Math.abs(controls[0]) <= Math.abs(controls[1])}
    <Vector3D direction={v} length={vLen} color={PrimeColor.raspberry} alwaysOnTop />
  {:else}
    <Vector3D direction={v} length={vLen} color={PrimeColor.raspberry} />
  {/if}

  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(controls[0])}
    offset={0.75}
    color={PrimeColor.raspberry}
  />

  <!-- If u & v are on the same quadrant and u is SMALLER than v -> v on top -->
  {#if controls[0] * controls[1] > 0 && Math.abs(controls[0]) > Math.abs(controls[1])}
    <Vector3D direction={u} length={uLen} color={PrimeColor.yellow} alwaysOnTop />
  {:else}
    <Vector3D direction={u} length={uLen} color={PrimeColor.yellow} />
  {/if}
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().normalize().multiplyScalar(controls[1])}
    offset={0.75}
    color={PrimeColor.yellow}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathrm{Span}\\{\\mathbf{u,v}\\}'} position={lineDir} offset={0.8} />
  <Axis3D />
</Canvas3D>
