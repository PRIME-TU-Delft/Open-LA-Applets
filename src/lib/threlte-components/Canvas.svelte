<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { Canvas, T } from '@threlte/core';
  import { Vector3 } from 'three';
  import CustomRenderer from './CustomRenderer.svelte';
  import Konami from './Konami.svelte';
  import SetCamera from './SetCamera.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let zoom = 29;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let width = '100%';
  export let height = 'auto';
  export let isIframe = false; // Is the scene inside an iframe?
  export let controls: Controls<G> | undefined = undefined;
  export let formulas: Formula[] = [];

  let enableEasterEgg = false;
</script>

<AbstractCanvas
  {title}
  {background}
  {showFormulasDefault}
  {formulas}
  {isIframe}
  let:width
  let:height
  let:resetKey
  bind:controls
  --height={height}
  --width={width}
>
  <Canvas size={{ width, height }}>
    <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

    <Konami on:konami={() => (enableEasterEgg = !enableEasterEgg)} debug />

    {#if enableEasterEgg}
      <CustomRenderer />
    {/if}

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>
</AbstractCanvas>
