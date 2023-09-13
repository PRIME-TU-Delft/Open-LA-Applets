<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import { Canvas } from '@threlte/core';
  import SetCamera from './SetCamera.svelte';
  import { Vector3 } from 'three';
  import { T } from '@threlte/core';
  import type { Sliders } from '$lib/utils/Slider';

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let zoom = 29;
  export let sliders: Sliders | undefined = undefined;
</script>

<AbstractCanvas let:width let:height let:resetKey bind:sliders>
  <Canvas size={{ width, height }}>
    <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>

  <svelte:fragment slot="formulas"><slot name="formulas" /></svelte:fragment>
</AbstractCanvas>
