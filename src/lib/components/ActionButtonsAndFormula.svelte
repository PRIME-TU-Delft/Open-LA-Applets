<script lang="ts" generics="State">
  import LatexUI from '$lib/components/Latex.svelte';
  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import Maximize from '@lucide/svelte/icons/maximize';
  import Minimize from '@lucide/svelte/icons/minimize';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import Share from '@lucide/svelte/icons/share';
  import SquareFunction from '@lucide/svelte/icons/square-function';
  import screenfull from 'screenfull';

  type G = readonly Controller<number | boolean | string | State>[];

  type ActionButtonsAndFormulaProps = {
    onReset: () => void;
    formulas?: Formula[];
    splitFormulas?: Formula[];
    controls: Controls<State, G> | undefined;
    showFormulas: boolean;
    hideControls?: boolean;
  };

  let {
    onReset,
    formulas = [],
    splitFormulas = [],
    controls = undefined,
    showFormulas = false,
    hideControls = false
  }: ActionButtonsAndFormulaProps = $props();

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
          class="mr-2 grid gap-1 rounded-md border-3 border-blue-500 bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md"
        >
          {#each formulas as formula (formula.id)}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      {/if}

      {#if splitFormulas && splitFormulas.length >= 1}
        <div class="grid gap-1 rounded-md bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md">
          {#each splitFormulas as formula (formula.id)}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if !hideControls}
    <!-- ACTION BUTTON -->
    <div class="top-0 right-0 float-end flex p-1">
      {#if !controls || controls.length == 0}
        <Button.Action
          side="bottom"
          class="scale-[0.8] rounded-md !bg-blue-200/80 shadow-sm backdrop-blur-md hover:!bg-blue-300/80"
          onclick={onReset}
          tooltip="Will reset the scene to original camera positions"
        >
          <RotateCcw class="h-5 w-5" />
        </Button.Action>
      {/if}

      <!-- SHARE BUTTON -->
      <Dialog.Root>
        <Dialog.Trigger
          class="scale-[0.8] rounded-md bg-blue-200/80 shadow-sm backdrop-blur-md hover:bg-blue-300/80"
        >
          <Button.Action side="bottom" tooltip="Share or embed applet">
            <Share class="h-5 w-5" />
          </Button.Action>
        </Dialog.Trigger>
        <ShareWindow />
      </Dialog.Root>

      <!-- FULLSCREEN BUTTON -->
      {#if screenfull.isEnabled && document}
        <Button.Action
          side="bottom"
          class="scale-[0.8] rounded-md !bg-blue-200/80 shadow-sm backdrop-blur-md hover:!bg-blue-300/80"
          onclick={toggleFullscreen}
          tooltip="{isFullscreen ? 'Exit' : 'Enter'} fullscreen"
        >
          {#if isFullscreen}
            <Minimize class="h-5 w-5" />
          {:else}
            <Maximize class="h-5 w-5" />
          {/if}
        </Button.Action>
      {/if}

      <!-- TOGGLE FORMULAE BUTTON -->
      {#if !globalState.isInset() && formulas && formulas.length >= 1}
        <Button.Action
          side="bottom"
          class="{!formulasShown
            ? '!bg-blue-200/80 hover:!bg-blue-300/80'
            : '!bg-blue-400/80 hover:!bg-blue-200/80'} scale-[0.8]  rounded-md border-0 border-blue-500 shadow-sm backdrop-blur-md {showFormulas
            ? 'border-2'
            : ''}"
          tooltip="Toggle function"
          onclick={() => (showFormulas = !showFormulas)}
        >
          <SquareFunction />
        </Button.Action>
      {/if}
    </div>
  {/if}
</div>
