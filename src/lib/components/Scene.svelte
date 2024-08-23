<script lang="ts" context="module">
  export type SceneProps = {
    controls?: Controls<any, readonly Controller<number | boolean | any>[]>;
    formulas?: Formula[];
    splitFormulas?: Formula[];
    showFormulasDefault?: boolean;
    draggables?: Draggable[];
    title?: string;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import type { Snippet } from 'svelte';
  import ActionButtonsAndFormula from './ActionButtonsAndFormula.svelte';
  import ActivityPanel from './ActivityPanel.svelte';
  import ControllerAndActivityPanel from './ControllerAndActivityPanel.svelte';
  import type { Draggable } from '$lib/controls/Draggables.svelte';
  import { dev } from '$app/environment';

  let {
    controls = undefined,
    formulas = [],
    splitFormulas = [],
    showFormulasDefault = false,
    draggables = [],
    title,
    children
  }: SceneProps = $props();

  /**
   * Reset camera position, rotation and controls.
   */
  function reset() {
    controls = controls?.reset(); // Reset controls to default values
    globalState.resetKey = Symbol(); // Update the key to reset the camera component

    draggables.forEach((d) => d.reset(750));
  }

  /**
   * Lock the activity state and reset the activity state after a certain time.
   * @param e MouseEvent | CustomEvent
   * TODO: remove CustomEvent as this is only required because ControllerAndActivityPanel requires it
   */
  function lock(e: MouseEvent | CustomEvent) {
    if (activityState.isActive) {
      e.stopPropagation();

      activityState.reset();
    }
  }

  /**
   * Wait for a certain time before resetting the activity state.
   */
  function waitThenReset() {
    if (globalState.inIframe) {
      activityState.disableAfterAnd(60000, reset);
    }
  }

  /**
   * Initialise the scene.
   */
  function initScene(_: HTMLDivElement) {
    if (globalState.inIframe) {
      activityState.reset();
    } else {
      activityState.enable();
    }
  }

  $effect(() => {
    // Override the global title if a title is provided
    // if and only if the global title is not set
    if (!globalState.title) globalState.title = title || '';
  });
</script>

<div
  class="outerWrapper overflow-hidden h-full bg-gradient-to-bl transition-all duration-500 from-white to-white p-2"
  class:active={activityState.isActive}
  use:initScene
>
  <div
    role="button"
    tabindex="0"
    class="canvasWrapper h-full rounded-lg motion-safe:scale-[0.97] motion-safe:transition-transform"
    class:inIframe={globalState.inIframe}
    class:active={activityState.isActive}
    class:dev
    bind:clientHeight={globalState.height}
    bind:clientWidth={globalState.width}
    style="height: var(--canvas-height, 100%);"
    onclick={() => activityState.enable()}
    onkeydown={() => activityState.enable()}
    onmousedown={() => activityState.enable()}
    onmouseenter={() => activityState.removeTimeout()}
    onmouseleave={() => waitThenReset()}
  >
    <!-- THRELTE/D3 SCENE (centre) -->
    <div class="flex w-full h-full divide-x-2 divide-slate-400 gap-3 bg-white">
      {#if children}
        {@render children()}
      {:else}
        <p class="m-4">Please enter some content using the Canvas2D or Canvas3D components</p>
      {/if}
    </div>

    <!-- TITLE PANEL (top-left) -->
    {#if globalState.title && globalState.isInset()}
      <div class="absolute left-2 top-2 bg-blue-200 rounded p-2">
        {globalState.title}
      </div>
    {/if}

    <!-- CONTROLLER PANEL / ACTIVITY PANEL (bottom-centre)  -->
    {#if controls && controls.length > 0 && controls._width > 0}
      <ControllerAndActivityPanel {controls} onLock={(e) => lock(e)} onReset={() => reset()} />
    {:else}
      <ActivityPanel onLock={(e) => lock(e)} />
    {/if}

    <!-- ACTION BUTTONS / FORMULAE (top-right) -->
    <ActionButtonsAndFormula
      showFormulas={showFormulasDefault}
      {formulas}
      {splitFormulas}
      {controls}
      onReset={() => reset()}
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
    margin: auto;
    @apply shadow-md;
  }

  .canvasWrapper.dev {
    resize: both;
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
