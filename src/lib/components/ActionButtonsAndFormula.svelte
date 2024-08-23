<script lang="ts" generics="State">
  import LatexUI from '$lib/components/Latex.svelte';
  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import { Maximize, Minimize, RotateCcw, Share, SquareFunction } from 'lucide-svelte';
  import screenfull from 'screenfull';

  type G = readonly Controller<number | boolean | State>[];

  type Canvas2DProps = {
    onReset: () => void;
    formulas?: Formula[];
    splitFormulas?: Formula[];
    controls: Controls<State, G> | undefined;
    showFormulas: boolean;
  };

  let {
    onReset,
    formulas = [],
    splitFormulas = [],
    controls = undefined,
    showFormulas = false
  }: Canvas2DProps = $props();

  let isFullscreen = $state(false); // Is the scene fullscreen?

  $effect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        isFullscreen = screenfull.isFullscreen;

        globalState.changeState({ isFullscreen });
      });
    }
  });

  function toggleFullscreen() {
    if (!screenfull.isEnabled || !document) return;

    screenfull.toggle(document.body);
  }

  let formulasShown = $derived(
    globalState.controlsInteractive || showFormulas || globalState.isInset()
  );
</script>

<div class="absolute top-1 right-0 select-none">
  <!-- FORMULAE -->
  {#if formulasShown}
    <div class="flex justify-end">
      {#if formulas && formulas.length >= 1}
        <div
          class="mr-2 grid gap-1 bg-blue-50/80 backdrop-blur-md p-2 rounded-md shadow-sm text-xs border-blue-500 border-3"
        >
          {#each formulas as formula}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      {/if}

      {#if splitFormulas && splitFormulas.length >= 1}
        <div class="grid gap-1 bg-blue-50/80 backdrop-blur-md p-2 rounded-md shadow-sm text-xs">
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
        onclick={onReset}
        tooltip="Will reset the scene to original camera positions"
      >
        <RotateCcw class="w-5 h-5" />
      </Button.Action>
    {/if}

    <!-- SHARE BUTTON -->
    <Dialog.Root>
      <Dialog.Trigger
        class="bg-blue-200/80 scale-[0.8] hover:bg-blue-300/80 backdrop-blur-md rounded-md shadow-sm"
      >
        <Button.Action side="bottom" tooltip="Share or embed applet">
          <Share class="w-5 h-5" />
        </Button.Action>
      </Dialog.Trigger>
      <ShareWindow />
    </Dialog.Root>

    <!-- FULLSCREEN BUTTON -->
    {#if screenfull.isEnabled && document}
      <Button.Action
        side="bottom"
        class="!bg-blue-200/80 scale-[0.8] hover:!bg-blue-300/80 backdrop-blur-md rounded-md shadow-sm"
        onclick={toggleFullscreen}
        tooltip="{isFullscreen ? 'Exit' : 'Enter'} fullscreen"
      >
        {#if isFullscreen}
          <Minimize class="w-5 h-5" />
        {:else}
          <Maximize class="w-5 h-5" />
        {/if}
      </Button.Action>
    {/if}

    <!-- TOGGLE FORMULAE BUTTON -->
    {#if !globalState.isInset() && formulas && formulas.length >= 1}
      <Button.Action
        side="bottom"
        class="{!formulasShown
          ? '!bg-blue-200/80 hover:!bg-blue-300/80'
          : '!bg-blue-400/80 hover:!bg-blue-200/80'} scale-[0.8]  backdrop-blur-md rounded-md shadow-sm border-blue-500 border-0 {showFormulas
          ? 'border-2'
          : ''}"
        tooltip="Toggle function"
        onclick={() => (showFormulas = !showFormulas)}
      >
        <SquareFunction />
      </Button.Action>
    {/if}
  </div>
</div>
