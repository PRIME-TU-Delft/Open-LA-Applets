<script lang="ts">
  import { page } from '$app/stores';
  import { activityStore } from '$lib/activityStore';
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  import FormulasAndActivityPanel from '$lib/components/FormulasAndActivityPanel.svelte';
  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import SliderPanel from '$lib/components/SliderPanel.svelte';
  import ToggleSliders from '$lib/components/ToggleSliders.svelte';
  import SetCamera from '$lib/threlte-components/SetCamera.svelte';
  import { Canvas, T } from '@threlte/core';
  import { onMount } from 'svelte';
  import { Vector3 } from 'three/src/Three';
  import { Sliders } from 'utils/Slider';

  export let enablePan = false;
  export let sliders = new Sliders();
  export let title = '';
  export let background = '#ffffff';
  export let zoom = 29;
  export let cameraPosition = new Vector3(10, 10, 10);

  let isPlayingSliders = false; // Are any of the sliders being changed AUTOMATIC?
  let isChangingSliders = false; // Are any of the sliders being changed MANUALLY?
  let isFullscreen = false; // Is the scene fullscreen?
  let isIframe = false; // Is the scene inside an iframe?

  let showFormulas = false; // Show the formulas panel (if it exists)

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

  function pause() {
    reset();
    activityStore.reset();
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

<div class="rounded overflow-hidden h-full drawer" bind:this={sceneEl}>
  <!-- For screen readers / accesability acces to toggle the drawer  -->
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />

  <div
    role="button"
    tabindex="0"
    class="canvasWrapper border-l-4 border-gray-400 drawer-content"
    class:active={$activityStore}
    class:isIframe
    bind:clientHeight={height}
    bind:clientWidth={width}
    style="height: var(--height, 100%); background: {background}"
    on:click={activityStore.enable}
    on:mousedown={activityStore.enable}
    on:keydown={activityStore.enable}
    on:mouseenter={activityStore.removeTimeOut}
    on:mouseleave={waitThenReset}
  >
    <!-- THRELTE SCENE -->
    {#key resetKey}
      <Canvas size={{ width, height }}>
        <SetCamera position={cameraPosition} {resetKey} {enablePan} {zoom} />

        <slot name="lights">
          <T.AmbientLight intensity={1} />
        </slot>

        <slot />
      </Canvas>
    {/key}

    <!-- TITLE PANEL -->
    {#if !isIframe || isFullscreen}
      <div class="menu absolute left-2 top-2 bg-base-100 rounded-lg p-4">
        {title}
      </div>
    {/if}

    <!-- SLIDER PANEL -->
    {#if sliders.sliders.length > 0}
      <SliderPanel isInset={!isIframe || isFullscreen}>
        <ToggleSliders
          bind:sliders
          bind:isPlaying={isPlayingSliders}
          on:startChanging={() => (isChangingSliders = true)}
          on:stopChanging={() => (isChangingSliders = false)}
        />
      </SliderPanel>
    {/if}

    <!-- FORMULAS AND ACTIVITY PANEL  -->
    <!-- Only show if there are formulas and (showFormulas is shown OR not an iframe OR is fullscreen) -->
    {#if !!$$slots.formulas}
      <FormulasAndActivityPanel
        {isIframe}
        {isFullscreen}
        {showFormulas}
        {isChangingSliders}
        on:pause={pause}
      >
        <slot name="formulas" />
      </FormulasAndActivityPanel>
    {/if}

    <!-- ACTION BUTTONS -->
    <ActionButtons
      {isIframe}
      {sceneEl}
      hasFormulas={$$slots.formulas}
      bind:isFullscreen
      bind:showFormulas
      on:reset={reset}
    />
  </div>

  <!-- SHARE WINDOW -->

  <ShareWindow {sliders} />
</div>

<style lang="postcss">
  :global(html:has(.isIframe)) {
    background: white;
  }

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
