<script lang="ts">
  import { dev } from '$app/environment';
  import LatexUI from '$lib/components/Latex.svelte';
  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { globalStateStore, isInset } from '$lib/stores/globalStateStore';
  import type { Controls } from '$lib/utils/Controls';
  import type { Formula } from '$lib/utils/Formulas';
  import {
    mdiDelete,
    mdiFullscreen,
    mdiFullscreenExit,
    mdiFunctionVariant,
    mdiRestart,
    mdiShare
  } from '@mdi/js';
  import screenfull from 'screenfull';
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let formulas: Formula[] = [];
  export let splitFormulas: Formula[] = [];
  export let controls: Controls<G> | undefined = undefined;
  export let showFormulas = false;

  const dispatch = createEventDispatcher();

  let isFullscreen = false; // Is the scene fullscreen?

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      isFullscreen = screenfull.isFullscreen;

      globalStateStore.changeState({ isFullscreen });
    });
  }

  function toggleFullscreen() {
    if (!screenfull.isEnabled || !document) return;

    screenfull.toggle(document.body);
  }

  $: formulasShown = $globalStateStore.controlsInteractive || showFormulas || $isInset;

  function clearLocalStorage(): void {
    localStorage.clear();
    location.reload();
  }
</script>

<div class="absolute top-1 right-0">
  <!-- FORMULAE -->
  {#if formulasShown}
    <div class="flex">
      {#if formulas && formulas.length >= 1}
        <div class="mr-2 grid gap-1 bg-blue-50/80 backdrop-blur-md p-2 rounded-md shadow-sm">
          {#each formulas as formula}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      {/if}

      {#if splitFormulas && splitFormulas.length >= 1}
        <div class="grid gap-1 bg-blue-50/80 backdrop-blur-md p-2 rounded-md shadow-sm">
          {#each splitFormulas as formula}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- ACTION BUTTON -->
  <div class="float-end right-0 top-0 p-1 flex">
    {#if !controls || controls.length == 0}
      <Button.Action
        side="bottom"
        class="!bg-blue-200/80 scale-[0.8] hover:!bg-blue-300/80 backdrop-blur-md rounded-md shadow-sm"
        on:click={() => dispatch('reset')}
        icon={mdiRestart}
        tooltip="Will reset the scene to original camera positions"
      />
    {/if}

    <!-- SHARE BUTTON -->
    <Dialog.Root>
      <Dialog.Trigger
        class="bg-blue-200/80 scale-[0.8] hover:bg-blue-300/80 backdrop-blur-md rounded-md shadow-sm"
      >
        <Button.Action side="bottom" icon={mdiShare} tooltip="Share or embed applet" />
      </Dialog.Trigger>
      <ShareWindow />
    </Dialog.Root>

    <!-- FULLSCREEN BUTTON -->
    {#if screenfull.isEnabled && document}
      <Button.Action
        side="bottom"
        class="!bg-blue-200/80 scale-[0.8] hover:!bg-blue-300/80 backdrop-blur-md rounded-md shadow-sm"
        on:click={toggleFullscreen}
        icon={isFullscreen ? mdiFullscreenExit : mdiFullscreen}
        tooltip="{isFullscreen ? 'Exit' : 'Enter'} fullscreen"
      />
    {/if}

    <!-- TOGGLE FORMULAE -->
    {#if !$isInset && formulas && formulas.length >= 1}
      <Button.Action
        side="bottom"
        class="{!formulasShown
          ? '!bg-blue-200/80 hover:!bg-blue-300/80'
          : '!bg-blue-400/80 hover:!bg-blue-200/80'} scale-[0.8]  backdrop-blur-md rounded-md shadow-sm"
        icon={mdiFunctionVariant}
        tooltip="Toggle function"
        on:click={() => (showFormulas = !showFormulas)}
      />
    {/if}
  </div>
</div>

{#if dev}
  <button on:click={clearLocalStorage}>
    <Tooltip.Root>
      <Tooltip.Trigger
        class="absolute bottom-2 flex gap-1 px-2 py-1 items-center rounded-md text-blue-900 hover:opacity-100 opacity-20 transition-opacity left-2 bg-blue-300 hover:bg-blue-300/80 backdrop-blur-md"
      >
        <span>Dev:</span>
        <Icon path={mdiDelete} />
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <p>Clear localStorage cache for draggables</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </button>
{/if}
