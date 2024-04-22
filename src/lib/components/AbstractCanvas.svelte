<script lang="ts">
  import { page } from '$app/stores';
  import ActionButtonsAndFormula from '$lib/components/ActionButtonsAndFormula.svelte';
  import ControllerAndActivityPanel from '$lib/components/ControllerAndActivityPanel.svelte';
  import { isActive } from '$lib/stores/activityStore';
  import { globalStateStore, isInset } from '$lib/stores/globalStateStore';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import { onDestroy, onMount } from 'svelte';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import ActivityPanel from './ActivityPanel.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  /** "The ability to enable move (translate) the applet. On devices with a mouse this can be controlled by right mouse button dragging. On touchscreen devices, this can be done by dragging with two finders on the screen."*/
  export let controls: Controls<G> | undefined = undefined;
  export let title = '';
  export let background = '#ffffff';
  export let showFormulasDefault = false;
  export let inIframe = false; // Is the scene inside an iframe?
  export let formulas: Formula[] = [];
  export let splitFormulas: Formula[] = [];

  let resetKey = generateUUID();
  let height = 0;
  let width = 0;

  /**
   * Reset camera position, rotation and controls.
   */
  function reset() {
    controls = controls?.reset(); // Reset controls to default values
    resetKey = generateUUID(); // Update the key to reset the set camera component
  }

  function pause() {
    if ($isActive) {
      isActive.reset();
    }

    reset();
  }

  function waitThenReset() {
    if (inIframe) {
      isActive.disableAfterAnd(60000, reset);
    }
  }

  $: title = $globalStateStore.title ?? title;
  $: inIframe = $globalStateStore.inIframe ?? inIframe;

  // Derived state
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

<svelte:window on:resize={() => (resetKey = generateUUID())} />

<div
  class="outerWrapper overflow-hidden h-full bg-gradient-to-bl transition-all duration-500 from-white to-white p-2"
  class:active={$isActive}
>
  <div
    role="button"
    tabindex="0"
    class="canvasWrapper h-full rounded-lg motion-safe:scale-[0.97] motion-safe:transition-transform"
    class:inIframe
    class:active={$isActive}
    bind:clientHeight={height}
    bind:clientWidth={width}
    style="height: var(--canvas-height, 100%); background: {background}"
    on:click={isActive.enable}
    on:mousedown={isActive.enable}
    on:keydown={isActive.enable}
    on:mouseenter={isActive.removeTimeOut}
    on:mouseleave={waitThenReset}
  >
    <!-- THRELTE/D3 SCENE (centre) -->
    {#key resetKey}
      <div class="flex w-full h-full divide-x-2 divide-slate-400 gap-3">
        <slot {width} {height} {resetKey} />
      </div>
    {/key}

    <!-- TITLE PANEL (top-left) -->
    {#if title && $isInset}
      <div class="absolute left-2 top-2 bg-base-100 rounded-lg p-4">
        {title}
      </div>
    {/if}

    <!-- CONTROLLER PANEL / ACTIVITY PANEL (bottom-centre)  -->
    {#if controls && controls.length > 0}
      <ControllerAndActivityPanel on:pause={pause} on:reset={reset} bind:controls />
    {:else}
      <ActivityPanel on:pause={pause} />
    {/if}

    <!-- ACTION BUTTONS / FORMULAE (top-right) -->
    <ActionButtonsAndFormula
      bind:showFormulas={showFormulasDefault}
      {formulas}
      {splitFormulas}
      {controls}
      on:reset={reset}
    />
  </div>
</div>

<style lang="postcss">
  .outerWrapper.active {
    @apply from-blue-400 to-blue-500;
  }

  .canvasWrapper.active {
    @apply scale-100;
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
