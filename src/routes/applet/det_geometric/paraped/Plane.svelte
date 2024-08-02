<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { DoubleSide } from 'three';

  export let position: [number, number, number] = [0, 0, 0];
  export let color: string = PrimeColor.blue;
  export let size: [number, number] = [1, 1];
</script>

<T.Mesh rotation={[Math.PI / 2, 0, 0]} {position}>
  <T.MeshBasicMaterial side={DoubleSide} {color} transparent opacity={0.5} />
  <T.PlaneGeometry args={[...size, 1, 1]} />
</T.Mesh>
