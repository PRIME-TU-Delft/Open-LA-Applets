<script lang="ts">
  import { page } from '$app/stores';
  import { isActive } from '$lib/stores/activityStore';
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  import ControllerPanel from '$lib/components/ControllerPanel.svelte';
  import FormulasAndActivityPanel from '$lib/components/FormulasAndActivityPanel.svelte';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { onDestroy, onMount } from 'svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  /** "The ability to enable move (translate) the applet. On devices with a mouse this can be controlled by right mouse button dragging. On touchscreen devices, this can be done by dragging with two finders on the screen."*/
  export let controls: Controls<G> | undefined = undefined;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let isIframe = false; // Is the scene inside an iframe?
  export let formulas: Formula[] = [];

  let isPlayingSliders = false; // Are any of the sliders being changed AUTOMATIC?
  let isChangingSliders = false; // Are any of the sliders being changed MANUALLY?
  let isFullscreen = false; // Is the scene fullscreen?

  let showFormulas = showFormulasDefault; // Show the formulas panel (if it exists)

  let resetKey = Math.random();
  let height = 0;
  let width = 0;

  let sceneEl: HTMLDivElement;

  /**
   * Reset camera position, rotation and controls.
   */
  function reset() {
    controls = controls?.reset(); // Reset controls to default values
    resetKey = Math.random(); // Update the key to reset the set camera component
  }

  function pause() {
    reset();
    isActive.reset();
  }

  $: {
    const params = $page.url?.searchParams;
    title = params?.get('title') || title;
  }

  function waitThenReset() {
    if (isIframe) {
      isActive.disableAfterAnd(60000, reset);
    }
  }

  onMount(() => {
    const params = $page.url?.searchParams;

    if (controls) {
      controls = controls.fromURL(params?.get('controls') || '') || controls;
    }

    isIframe = JSON.parse(params?.get('iframe') || 'false') || isIframe;

    if (!isIframe) {
      isActive.enable();
    }
  });

  onDestroy(() => reset);
</script>

<div class="rounded overflow-hidden h-full" bind:this={sceneEl}>
  <div
    role="button"
    tabindex="0"
    class="canvasWrapper h-full border-l-4 border-slate-400"
    class:active={$isActive}
    class:isIframe
    bind:clientHeight={height}
    bind:clientWidth={width}
    style="height: var(--canvas-height, 100%); background: {background}"
    on:click={isActive.enable}
    on:mousedown={isActive.enable}
    on:keydown={isActive.enable}
    on:mouseenter={isActive.removeTimeOut}
    on:mouseleave={waitThenReset}
  >
    <!-- THRELTE SCENE -->
    {#key resetKey}
      <div class="flex w-full h-full divide-x-2 divide-slate-400 gap-3">
        <slot {width} {height} {resetKey} />
      </div>
    {/key}

    <!-- TITLE PANEL -->
    {#if title && (!isIframe || isFullscreen)}
      <div class="menu absolute left-2 top-2 bg-base-100 rounded-lg p-4">
        {title}
      </div>
    {/if}

    <!-- SLIDER PANEL -->
    {#if controls && controls.length > 0}
      <ControllerPanel
        isInset={!isIframe || isFullscreen}
        bind:controls
        bind:isPlaying={isPlayingSliders}
        on:startChanging={() => (isChangingSliders = true)}
        on:stopChanging={() => (isChangingSliders = false)}
      />
    {/if}

    <!-- FORMULAS AND ACTIVITY PANEL  -->
    <!-- Only show if there are formulas and (showFormulas is shown OR not an iframe OR is fullscreen) -->

    <FormulasAndActivityPanel
      {isIframe}
      {isFullscreen}
      {showFormulas}
      {formulas}
      {isChangingSliders}
      on:pause={pause}
    />

    <!-- ACTION BUTTONS -->
    <ActionButtons {isIframe} {sceneEl} bind:isFullscreen on:reset={reset} />
  </div>

  <!-- SHARE WINDOW -->
</div>

<style lang="postcss">
  :global(html:has(.isIframe)) {
    background: white;
  }

  .canvasWrapper {
    position: relative;
    width: var(--width, 100%);
    height: var(--canvas-height, 100%);
    overflow: hidden;

    &.isIframe {
      @apply border-l-4 border-gray-400;

      &.active {
        @apply border-blue-500;
      }
    }
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
