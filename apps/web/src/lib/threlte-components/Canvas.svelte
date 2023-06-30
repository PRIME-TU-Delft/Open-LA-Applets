<script lang="ts">
  import { page } from '$app/stores';

  import { mdiInformation, mdiRestart } from '@mdi/js';

  import { Canvas, T } from '@threlte/core';

  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import SetCamera from '$lib/threlte-components/SetCamera.svelte';
  import { onMount } from 'svelte';
  import { RoundButton, ToggleFullscreen, ToggleSliders, UI } from 'ui';
  import { Sliders } from 'utils/Slider';
  import { activityStore } from '$lib/activityStore';

  export let enablePan = false;
  export let sliders = new Sliders();
  export let title = '';
  export let background = '#ffffff';
  export let zoom = 29;

  let isPlayingSliders = false; // Are any of the sliders being changed AUTOMATIC?
  let isFullscreen = false; // Is the scene fullscreen?

  let showFormulas = false; // Show the formulas panel (if it exists)

  let resetCamera = Math.random();
  let height = 0;
  let width = 0;

  let sceneEl: HTMLDivElement;

  /**
   * Reset camera position, rotation and sliders.
   */
  function reset() {
    sliders = sliders.reset(); // Reset sliders to default values
    resetCamera = Math.random(); // Update the key to reset the set camera component
  }

  $: {
    const params = $page.url.searchParams;
    title = params.get('title') || title;
  }

  onMount(() => {
    const params = $page.url.searchParams;

    sliders = sliders.fromURL(params?.get('sliders') || '') || sliders;
  });
</script>

<div
  role="button"
  tabindex="0"
  class="canvasWrapper rounded-xl outline-4 outline-gray-400 -outline-offset-4 outline"
  class:active={$activityStore}
  bind:clientHeight={height}
  bind:clientWidth={width}
  bind:this={sceneEl}
  style="height: var(--height, 100%); background: {background}"
  on:click={() => {
    console.log('click');
    activityStore.enable();
  }}
  on:keydown={activityStore.enable}
  on:mouseenter={activityStore.removeTimeOut}
  on:mouseleave={() => activityStore.disableAfterAnd(500, reset)}
>
  <Canvas size={{ width, height }}>
    {#key resetCamera}
      <SetCamera {enablePan} {zoom} />
    {/key}

    <slot name="lights">
      <T.AmbientLight intensity={1} />
    </slot>

    <slot />
  </Canvas>

  <div class="absolute left-0 top-0 z-50 select-none">
    {#if !isFullscreen && $activityStore}
      <p class="p-2 bg-blue-500 rounded w-fit text-white">Interactive mode</p>
    {:else if !isFullscreen}
      <p class="p-2 bg-gray-400 rounded w-fit text-white">Click to once to enable interactivity</p>
    {/if}
  </div>

  <!-- TITLE PANEL -->
  <UI top left visible={!!title && isFullscreen}>
    {title}
  </UI>

  <!-- SLIDER PANEL -->
  <div style="max-width: calc(100vw - 6rem); touch-action:none;">
    <UI visible={!!sliders.sliders.length} bottom opacity>
      <ToggleSliders
        bind:sliders
        bind:isPlaying={isPlayingSliders}
        on:startChanging={() => (showFormulas = true)}
        on:stopChanging={() => (showFormulas = false)}
      />
    </UI>
  </div>

  <!-- INFORMATION UI -->
  <UI visible={!!$$slots.formulas} top right styled={false} opacity={!showFormulas}>
    <RoundButton icon={mdiInformation} on:click={() => (showFormulas = !showFormulas)} />
  </UI>

  <UI visible={!!$$slots.formulas && (showFormulas || isPlayingSliders)} top column>
    <slot name="formulas" />
  </UI>

  <!-- ACTION BUTTONS -->
  <UI column bottom right opacity styled={false}>
    <RoundButton icon={mdiRestart} on:click={reset} />
    <ToggleFullscreen {sceneEl} bind:isFullscreen />
  </UI>

  <!-- SHARE BUTTON -->
  <ShareWindow {sliders} />
</div>

<style lang="postcss">
  .canvasWrapper {
    position: relative;
    width: var(--width, 100vw);
    overflow: hidden;
  }

  .active {
    @apply outline-blue-500;
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
