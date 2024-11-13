<script lang="ts" module>
  export type Point3DProps = {
    position: Vector3;
    color?: string;
    size?: number;
    alwaysOnTop?: boolean;
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { Mesh, SphereGeometry, Vector3 } from 'three';

  let {
    position = new Vector3(0, 0, 0), // test
    color = PrimeColor.getRandomColor(),
    size = 0.125,
    alwaysOnTop = true
  }: Point3DProps = $props();

  let pointMesh = $state<Mesh>();
  const geometry = $derived(new SphereGeometry(size, 32, 16));

  $effect(() => {
    if (!pointMesh) return;

    pointMesh.renderOrder = 305;
  });
</script>

<T.Group position={[position.x, position.y, position.z]}>
  <T.Mesh bind:ref={pointMesh} {geometry}>
    {#if alwaysOnTop}
      <T.MeshBasicMaterial {color} {size} transparent depthTest={false} depthWrite={false} />
    {:else}
      <T.MeshBasicMaterial {color} {size} />
    {/if}
  </T.Mesh>
</T.Group>
