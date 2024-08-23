<script lang="ts">
  /***
   * @Component This Compoenent is a 3d Point with an optional label
   * */

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { Mesh, SphereGeometry, Vector3 } from 'three';

  type Point3DProps = {
    position: Vector3;
    color?: string;
    size?: number;
    alwaysOnTop?: boolean;
  };

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

<T.Mesh bind:ref={pointMesh} {geometry} position={[position.x, position.y, position.z]}>
  {#if alwaysOnTop}
    <T.MeshBasicMaterial {color} {size} transparent depthTest={false} depthWrite={false} />
  {:else}
    <T.MeshBasicMaterial {color} {size} />
  {/if}
</T.Mesh>
