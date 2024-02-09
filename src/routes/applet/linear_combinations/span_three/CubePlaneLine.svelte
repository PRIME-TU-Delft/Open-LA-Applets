<script lang="ts">
  import { PlaneFromPoints } from '$lib/threlte-components';
  import Line2 from '$lib/threlte-components/Line2.svelte';
  import type { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Toggle } from '$lib/utils/Toggle';
  import { T } from '@threlte/core';
  // import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { Vector3 } from 'three';

  export let toggles: Controls<readonly [Toggle, Toggle, Toggle]>;
  export let uvw: [Vector3, Vector3, Vector3];

  const CUBE_SIZE = 15;
</script>

{#if toggles[0] && toggles[1] && toggles[2]}
  <!-- TODO -->
  <!-- <T.Mesh> -->
  <!-- <MeshLineGeometry {points} /> -->
  <!-- <MeshLineMaterial width={0.5} color="#fe3d00" /> -->
  <!-- </T.Mesh> -->

  <T.Mesh>
    <T.BoxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
    <T.MeshBasicMaterial color={PrimeColor.yellow} opacity={0.5} transparent />
  </T.Mesh>
{:else if (toggles[0] && toggles[1]) || (toggles[0] && toggles[2]) || (toggles[1] && toggles[2])}
  {@const u = toggles[0] ? uvw[0] : new Vector3()}
  {@const v = toggles[1] ? uvw[1] : new Vector3()}
  {@const w = toggles[2] ? uvw[2] : new Vector3()}
  <PlaneFromPoints points={[u, v, w]} color={PrimeColor.yellow} />
{:else if toggles[0] || toggles[1] || toggles[2]}
  {#each toggles as toggle, i}
    {#if toggle}
      <Line2
        origin={uvw[i].clone().normalize().multiplyScalar(-10)}
        endPoint={uvw[i].clone().normalize().multiplyScalar(10)}
        color={PrimeColor.yellow}
      />
    {/if}
  {/each}
{/if}
