<script lang="ts">
  import { page } from '$app/stores';

  import { mdiInformation, mdiRestart, mdiPause } from '@mdi/js';

  import { Canvas, T } from '@threlte/core';

  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import SetCamera from '$lib/threlte-components/SetCamera.svelte';
  import { onMount } from 'svelte';
  import { RoundButton, ToggleFullscreen, ToggleSliders, UI } from 'ui';
  import { Sliders } from 'utils/Slider';
  import { activityStore } from '$lib/activityStore';
  import { Vector3 } from 'three/src/Three';
  import { Icon } from 'mdi-svelte-ts';
  import ActionButtons from '$lib/components/ActionButtons.svelte';

  export let enablePan = false;
  export let sliders = new Sliders();
  export let title = '';
  export let background = '#ffffff';
  export let zoom = 29;
  export let cameraPosition = new Vector3(10, 10, 10);

  let isPlayingSliders = false; // Are any of the sliders being changed AUTOMATIC?
  let isFullscreen = false; // Is the scene fullscreen?
  let isIframe = false; // Is the scene inside an iframe?

  let showFormulas = true; // Show the formulas panel (if it exists)

  let resetKey = Math.random();
  let height = 0;
  let width = 0;

  let sceneEl: HTMLDivElement;

  /**
   * Reset camera position, rotation and sliders.
   */
  function reset() {
    sliders = sliders.reset(); // Reset sliders to default values
    resetKey = Math.random(); // Update the key to reset the set camera component
  }

  $: {
    const params = $page.url.searchParams;
    title = params.get('title') || title;
  }

  function waitThenReset() {
    if (isIframe) {
      activityStore.disableAfterAnd(60000, reset);
    }
  }

  onMount(() => {
    const params = $page.url.searchParams;

    sliders = sliders.fromURL(params?.get('sliders') || '') || sliders;
    isIframe = JSON.parse(params.get('iframe') || 'false') || false;

    if (!isIframe) {
      activityStore.enable();
    }
  });
</script>

<div class="rounded overflow-hidden h-full">
  <div
    role="button"
    tabindex="0"
    class="canvasWrapper border-l-4 border-gray-400"
    class:active={$activityStore}
    bind:clientHeight={height}
    bind:clientWidth={width}
    bind:this={sceneEl}
    style="height: var(--height, 100%); background: {background}"
    on:click={activityStore.enable}
    on:mousedown={activityStore.enable}
    on:keydown={activityStore.enable}
    on:mouseenter={activityStore.removeTimeOut}
    on:mouseleave={waitThenReset}
  >
    {#key resetKey}
      <Canvas size={{ width, height }}>
        <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

        <slot name="lights">
          <T.AmbientLight intensity={1} />
        </slot>

        <slot />
      </Canvas>
    {/key}

    {#if isIframe}
      <div class="absolute top-0 z-50 select-none w-full">
        {#if !isFullscreen && $activityStore}
          <p class="py-3 px-6 bg-blue-500/90 rounded-r w-fit text-white">Interactive mode</p>
        {:else if !isFullscreen}
          <p class="py-3 px-6 bg-base-100/70 rounded-r">Click once to enable interactivity</p>
        {/if}
      </div>
    {/if}

    <!-- TITLE PANEL -->
    <UI top left visible={!!title && isFullscreen}>
      {title}
    </UI>

    <!-- SLIDER PANEL -->
    <div style="max-width: calc(100vw - 6rem); touch-action:none;">
      <UI visible={!!sliders.sliders.length} bottom opacity>
        {#key resetKey}
          <ToggleSliders
            bind:sliders
            bind:isPlaying={isPlayingSliders}
            on:startChanging={() => (showFormulas = true)}
            on:stopChanging={() => (showFormulas = false)}
          />
        {/key}
      </UI>
    </div>

    <UI visible={!!$$slots.formulas && (showFormulas || isPlayingSliders)} top right>
      <slot name="formulas" />
    </UI>

    <!-- ACTION BUTTONS -->
    <ActionButtons
      {isIframe}
      {sceneEl}
      hasFormulas={$$slots.formulas}
      bind:isFullscreen
      on:pause={() => {
        reset();
        activityStore.reset();
      }}
      on:reset={reset}
      on:toggle-formulas={() => (showFormulas = !showFormulas)}
    />

    <!-- SHARE BUTTON -->
    <ShareWindow {sliders} />
  </div>
</div>

<style lang="postcss">
  .canvasWrapper {
    position: relative;
    width: var(--width, 100vw);
    overflow: hidden;
  }

  .active {
    @apply border-blue-500;
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
