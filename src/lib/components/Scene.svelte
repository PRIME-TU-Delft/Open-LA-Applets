<script lang="ts" module>
  export type SceneProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controls?: Controls<any, readonly Controller<number | boolean | string | any>[]>;
    formulas?: Formula[];
    splitFormulas?: Formula[];
    showFormulasDefault?: boolean;
    draggables?: Draggable[];
    title?: string;
    sceneChildren?: Snippet<[number, number]>;
  };
</script>

<script lang="ts">
  import { dev } from '$app/environment';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import type { Draggable } from '$lib/controls/Draggables.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import type { Snippet } from 'svelte';
  import ActionButtonsAndFormula from './ActionButtonsAndFormula.svelte';
  import ActivityPanel from './ActivityPanel.svelte';
  import ControllerAndActivityPanel from './ControllerAndActivityPanel.svelte';
  import FpsCounter from './FpsCounter.svelte';
  import { cn } from '$lib/utils';

  let {
    controls = undefined,
    formulas = [],
    splitFormulas = [],
    showFormulasDefault = false,
    draggables = [],
    title,
    sceneChildren
  }: SceneProps = $props();

  let height = $state(500);
  let width = $state<number>(0);

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
  class={cn(
    'outerWrapper h-full overflow-hidden bg-gradient-to-bl from-white to-white p-2 transition-all duration-500',
    activityState.isActive && 'from-blue-400 to-blue-500'
  )}
  use:initScene
>
  <div
    role="button"
    tabindex="0"
    class={cn(
      'canvasWrapper h-full rounded-lg shadow-md motion-safe:scale-[0.97] motion-safe:transition-transform',
      activityState.isActive && 'motion-safe:scale-100'
    )}
    class:inIframe={globalState.inIframe}
    class:dev
    bind:clientHeight={height}
    bind:clientWidth={width}
    style="height: var(--canvas-height, 100%);"
    onclick={() => activityState.enable()}
    onkeydown={() => activityState.enable()}
    onmousedown={() => activityState.enable()}
    onmouseenter={() => activityState.removeTimeout()}
    onmouseleave={() => waitThenReset()}
  >
    <!-- MARK: THRELTE/D3 SCENE (centre) -->
    <div class="flex h-full w-full gap-3 divide-x-2 divide-slate-400 bg-white">
      {#if sceneChildren && width > 0}
        {@render sceneChildren(width, height)}
      {:else}
        <p class="m-4">Please enter some content using the Canvas2D or Canvas3D components</p>
      {/if}
    </div>

    <!-- MARK: TITLE PANEL (top-left) -->
    {#if globalState.title && globalState.isInset()}
      <div class="absolute top-2 left-2 rounded bg-blue-200 p-2">
        {globalState.title}
      </div>
    {/if}

    {#if dev}
      <FpsCounter />
    {/if}

    <!-- MARK: CONTROLLER PANEL / ACTIVITY PANEL (bottom-centre)  -->
    {#if controls && controls.length > 0 && controls._width > 0}
      <ControllerAndActivityPanel {controls} onLock={(e) => lock(e)} onReset={() => reset()} />
    {:else}
      <ActivityPanel onLock={(e) => lock(e)} />
    {/if}

    <!-- MARK: ACTION BUTTONS / FORMULAE (top-right) -->
    <ActionButtonsAndFormula
      showFormulas={showFormulasDefault}
      {formulas}
      {splitFormulas}
      {controls}
      onReset={() => reset()}
    />
  </div>
</div>

<style>
  .canvasWrapper {
    position: relative;
    width: var(--width, 100%);
    height: var(--canvas-height, 100%);
    overflow: hidden;
    margin: auto;
  }

  .canvasWrapper.dev {
    resize: both;
  }

  :global(.canvasWrapper > canvas) {
    position: absolute;
  }
</style>
