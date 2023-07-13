<script lang="ts">
  /***
   * This Compoenent is a 3d Point with an optional label
   * */

  import { T } from '@threlte/core';
  import { SphereGeometry, Vector3 } from 'three';
  import getRandomColor from 'utils/PrimeColors';

  export let position: Vector3 = new Vector3(0, 0, 0); // position of the point and label
  export let color: string = getRandomColor(); // color of point and label
  export let size = 0.125; // Size of dot and label
  export let alwaysOnTop = true; // whether the point is rendered on top of everything else

  const geometry = new SphereGeometry(size, 32, 16);
</script>

<T.Mesh
  {geometry}
  position={[position.x, position.y, position.z]}
  on:create={({ ref }) => {
    ref.renderOrder = 305;
  }}
>
  {#if alwaysOnTop}
    <T.MeshBasicMaterial {color} {size} transparent depthTest={false} depthWrite={false} />
  {:else}
    <T.MeshBasicMaterial {color} {size} />
  {/if}
</T.Mesh>
