<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Canvas, T } from '@threlte/core';
  import { Vector3 } from 'three';
  import SetCamera from './SetCamera.svelte';
  import type { Formula } from '$lib/utils/Formulas';

  export let cameraPosition = new Vector3(10, 10, 10);
  export let enablePan = false;
  export let zoom = 29;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let sliders: Sliders | undefined = undefined;
  export let formulas: Formula[] = [];
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
  bind:sliders
>
  <Canvas size={{ width, height }}>
    <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>
</AbstractCanvas>
