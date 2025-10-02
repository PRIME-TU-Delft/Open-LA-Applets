<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';
  import { Vector3 } from 'three';

  let controls = Controls.addSlider(3, -5, 5, 0.5, PrimeColor.raspberry, {
    label: 'v',
    labelFormat
  }).addSlider(5, -5, 5, 0.5, PrimeColor.blue, {
    label: 'u',
    labelFormat
  });

  const v = $derived(new Vector3(3, 2, -3).normalize().multiplyScalar(3)); // Vector v;
  const u = $derived(v.clone().multiplyScalar(2)); // Vector u = 2 * v;
  const lineDir = $derived(v.clone().normalize().multiplyScalar(10));

  const vLen = $derived(Math.abs(controls[0]) < 1 ? (controls[0] < 0 ? -1 : 1) : controls[0]);
  const uLen = $derived(Math.abs(controls[1]) < 1 ? (controls[1] < 0 ? -1 : 1) : controls[1]);
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D
  title={{ en: 'Span of two parallel vectors', nl: 'De span van twee parallelle vectoren' }}
  {controls}
>
  <!-- If u & v are on the same quadrant and v is SMALLER OR EQUAL TO than u -> u on top -->
  {#if controls[0] * controls[1] >= 0 && Math.abs(controls[0]) <= Math.abs(controls[1])}
    <Vector3D direction={v} length={vLen} color={PrimeColor.raspberry} alwaysOnTop />
  {:else}
    <Vector3D direction={v} length={vLen} color={PrimeColor.raspberry} />
  {/if}

  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(controls[0])}
    extend={0.75}
    color={PrimeColor.raspberry}
  />

  <!-- If u & v are on the same quadrant and u is SMALLER than v -> v on top -->
  {#if controls[0] * controls[1] > 0 && Math.abs(controls[0]) > Math.abs(controls[1])}
    <Vector3D direction={u} length={uLen} color={PrimeColor.blue} alwaysOnTop />
  {:else}
    <Vector3D direction={u} length={uLen} color={PrimeColor.blue} />
  {/if}
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().normalize().multiplyScalar(controls[1])}
    extend={0.75}
    color={PrimeColor.blue}
  />

  <Line3D
    origin={lineDir.clone().multiplyScalar(-1)}
    endPoint={lineDir}
    color={PrimeColor.yellow}
  />
  <Latex3D latex={'\\mathrm{Span}\\{\\mathbf{u,v}\\}'} position={lineDir} extend={0.8} />

  <Axis3D />
</Canvas3D>
