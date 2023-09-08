<script>
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import { Canvas } from '@threlte/core';
  import SetCamera from './SetCamera.svelte';
  import { Vector3 } from 'three';
  import { T } from '@threlte/core';

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let zoom = 29;
</script>

<AbstractCanvas let:width let:height let:resetKey>
  <Canvas size={{ width, height }}>
    <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>
</AbstractCanvas>
