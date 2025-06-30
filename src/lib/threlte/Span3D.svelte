<script lang="ts">
  import Line3D from '$lib/threlte/Line3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { Vector3 } from 'three';
  import Point3D from './Point3D.svelte';

  type CubePlaneLineProps = {
    toggles: readonly [boolean, boolean, boolean];
    vectors: [Vector3, Vector3, Vector3];
    cubeSize?: number;
    origin?: Vector3;
    color?: string;
  };

  let {
    toggles,
    vectors,
    cubeSize = 15,
    origin = new Vector3(),
    color = PrimeColor.yellow
  }: CubePlaneLineProps = $props();
</script>

{#if toggles[0] && toggles[1] && toggles[2]}
  <T.Mesh scale={0.5}>
    <MeshLineGeometry
      points={[
        new Vector3(-cubeSize, -cubeSize, -cubeSize),
        new Vector3(-cubeSize, -cubeSize, cubeSize),
        new Vector3(-cubeSize, cubeSize, cubeSize),
        new Vector3(-cubeSize, cubeSize, -cubeSize),
        new Vector3(-cubeSize, -cubeSize, -cubeSize),
        new Vector3(cubeSize, -cubeSize, -cubeSize),
        new Vector3(cubeSize, -cubeSize, cubeSize),
        new Vector3(cubeSize, cubeSize, cubeSize),
        new Vector3(cubeSize, cubeSize, -cubeSize),
        new Vector3(-cubeSize, cubeSize, -cubeSize),
        new Vector3(cubeSize, cubeSize, -cubeSize),
        new Vector3(cubeSize, cubeSize, cubeSize),
        new Vector3(-cubeSize, cubeSize, cubeSize),
        new Vector3(-cubeSize, cubeSize, -cubeSize),
        new Vector3(cubeSize, cubeSize, -cubeSize)
      ]}
    />
    <MeshLineMaterial width={0.01} color={PrimeColor.black} opacity={0.5} transparent />
  </T.Mesh>

  <T.Mesh scale={0.5}>
    <MeshLineGeometry
      points={[
        new Vector3(cubeSize, -cubeSize, -cubeSize),
        new Vector3(cubeSize, cubeSize, -cubeSize),
        new Vector3(-cubeSize, cubeSize, -cubeSize),
        new Vector3(-cubeSize, -cubeSize, -cubeSize),
        new Vector3(-cubeSize, -cubeSize, cubeSize),
        new Vector3(cubeSize, -cubeSize, cubeSize)
      ]}
    />
    <MeshLineMaterial width={0.01} color={PrimeColor.black} opacity={0.5} transparent />
  </T.Mesh>

  <T.Mesh>
    <T.BoxGeometry args={[cubeSize, cubeSize, cubeSize]} />
    <T.MeshBasicMaterial {color} opacity={0.5} transparent />
  </T.Mesh>
{:else if (toggles[0] && toggles[1]) || (toggles[0] && toggles[2]) || (toggles[1] && toggles[2])}
  {@const u = toggles[0] ? vectors[0] : new Vector3()}
  {@const v = toggles[1] ? vectors[1] : new Vector3()}
  {@const w = toggles[2] ? vectors[2] : new Vector3()}
  <PlaneFromPoints points={[u, v, w]} {color} />
{:else if toggles[0] || toggles[1] || toggles[2]}
  {#each toggles as toggle, i}
    {#if toggle}
      <Line3D
        origin={vectors[i].clone().normalize().multiplyScalar(-10)}
        endPoint={vectors[i].clone().normalize().multiplyScalar(10)}
        {color}
        radius={1.5}
      />
    {/if}
  {/each}
{:else}
  <Point3D position={origin} {color} />
{/if}
