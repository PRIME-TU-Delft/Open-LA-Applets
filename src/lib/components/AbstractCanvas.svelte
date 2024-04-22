<script lang="ts">
  import { page } from '$app/stores';
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  import ControllerPanel from '$lib/components/ControllerPanel.svelte';
  import FormulasAndActivityPanel from '$lib/components/FormulasAndActivityPanel.svelte';
  import { isActive } from '$lib/stores/activityStore';
  import { globalStateStore, isInset } from '$lib/stores/globalStateStore';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { onDestroy, onMount } from 'svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  /** "The ability to enable move (translate) the applet. On devices with a mouse this can be controlled by right mouse button dragging. On touchscreen devices, this can be done by dragging with two finders on the screen."*/
  export let controls: Controls<G> | undefined = undefined;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let inIframe = false; // Is the scene inside an iframe?
  export let formulas: Formula[] = [];

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
    const params = $page?.url?.searchParams;
    title = params?.get('title') || title;
  }

  function waitThenReset() {
    if (inIframe) {
      isActive.disableAfterAnd(60000, reset);
    }
  }

  $: inIframe = $globalStateStore.inIframe ?? inIframe;

  $: inIframe && isActive.reset();
  $: !inIframe && isActive.enable();

  onMount(() => {
    const params = $page?.url?.searchParams;

    if (controls) {
      controls = controls.fromURL(params?.get('controls') || '') || controls;
    }
  });

  onDestroy(() => reset);
</script>

<div
  class="rounded-[0.5rem] overflow-hidden h-full bg-gradient-to-bl transition-all duration-500 from-white to-white p-3"
  class:active={$isActive}
  bind:this={sceneEl}
>
  <div
    role="button"
    tabindex="0"
    class="canvasWrapper h-full rounded-[0.4rem]"
    class:inIframe
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
    {#if title && $isInset}
      <div class="absolute left-2 top-2 bg-base-100 rounded-lg p-4">
        {title}
      </div>
    {/if}

    <!-- SLIDER PANEL -->
    {#if controls && controls.length > 0}
      <ControllerPanel bind:controls />
    {/if}

    <!-- FORMULAS AND ACTIVITY PANEL  -->
    <!-- Only show if there are formulas and (showFormulas is shown OR not an iframe OR is fullscreen) -->

    <FormulasAndActivityPanel {showFormulas} {formulas} on:pause={pause} />

    <!-- ACTION BUTTONS -->
    <ActionButtons {sceneEl} bind:isFullscreen on:reset={reset} />
  </div>

  <!-- SHARE WINDOW -->
</div>

<style lang="postcss">
  :global(html:has(.inIframe)) {
    background: white;
  }

  .active {
    @apply from-blue-400 to-blue-500 p-1;
  }

  .canvasWrapper {
    position: relative;
    width: var(--width, 100%);
    height: var(--canvas-height, 100%);
    overflow: hidden;
    @apply shadow-md;
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
