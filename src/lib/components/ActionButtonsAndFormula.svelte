<script lang="ts" generics="State">
  import ShareWindow from '$lib/components/ShareWindow.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { LanguageInfo } from '$lib/utils/languages';
  import Languages from '@lucide/svelte/icons/languages';
  import Maximize from '@lucide/svelte/icons/maximize';
  import Minimize from '@lucide/svelte/icons/minimize';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import Share from '@lucide/svelte/icons/share';
  import SquareFunction from '@lucide/svelte/icons/square-function';
  import screenfull from 'screenfull';
  import { _ } from 'svelte-i18n';
  import LanguageWindow from './LanguageWindow.svelte';

  type G = readonly Controller<number | boolean | string | State>[];

  type ActionButtonsProps = {
    onReset: () => void;
    controls: Controls<State, G> | undefined;
    showFormulas: boolean;
    hasFormulasOrLegend: boolean;
    legendOffset?: number;
    hideButtons?: boolean;
    languages: LanguageInfo[];
    onToggleFormulas: () => void;
  };

  let {
    onReset,
    controls = undefined,
    showFormulas = false,
    hasFormulasOrLegend,
    languages,
    hideButtons = false,
    onToggleFormulas,
    legendOffset = 0
  }: ActionButtonsProps = $props();

  let isFullscreen = $state(false);
  let languageModalOpen = $state(false);

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
</script>

{#if !hideButtons}
  <!-- ACTION BUTTON -->
  <div class="absolute right-0 flex p-1 select-none" style="top: {4 + legendOffset}px">
    {#if !controls || controls.length == 0}
      <Button.Action
        side="bottom"
        class="scale-[0.8] rounded-md !bg-blue-200/80 shadow-sm backdrop-blur-md hover:!bg-blue-300/80"
        onclick={onReset}
        tooltip={$_('ui.reset_scene_tooltip')}
      >
        <RotateCcw class="h-5 w-5" />
      </Button.Action>
    {/if}

    <!-- SHARE BUTTON -->
    <Dialog.Root>
      <Dialog.Trigger
        class="scale-[0.8] rounded-md bg-blue-200/80 shadow-sm backdrop-blur-md hover:bg-blue-300/80"
      >
        <Button.Action side="bottom" tooltip={$_('ui.share_tooltip')}>
          <Share class="h-5 w-5" />
        </Button.Action>
      </Dialog.Trigger>
      <ShareWindow />
    </Dialog.Root>

    <!-- LANGUAGE BUTTON -->
    {#if languages.length > 1}
      <Dialog.Root bind:open={languageModalOpen}>
        <Dialog.Trigger
          class="scale-[0.8] rounded-md bg-blue-200/80 shadow-sm backdrop-blur-md hover:bg-blue-300/80"
        >
          <Button.Action tooltip={$_('ui.change_language')} side="bottom">
            <Languages class="h-5 w-5" />
          </Button.Action>
        </Dialog.Trigger>
        <LanguageWindow {languages} onclose={() => (languageModalOpen = false)} />
      </Dialog.Root>
    {/if}

    <!-- FULLSCREEN BUTTON -->
    {#if screenfull.isEnabled && document}
      <Button.Action
        side="bottom"
        class="scale-[0.8] rounded-md !bg-blue-200/80 shadow-sm backdrop-blur-md hover:!bg-blue-300/80"
        onclick={toggleFullscreen}
        tooltip={isFullscreen ? $_('ui.exit_fullscreen') : $_('ui.enter_fullscreen')}
      >
        {#if isFullscreen}
          <Minimize class="h-5 w-5" />
        {:else}
          <Maximize class="h-5 w-5" />
        {/if}
      </Button.Action>
    {/if}

    <!-- TOGGLE FORMULAE BUTTON -->
    {#if !globalState.isInset() && hasFormulasOrLegend}
      <Button.Action
        side="bottom"
        class="{!showFormulas
          ? '!bg-blue-200/80 hover:!bg-blue-300/80'
          : '!bg-blue-400/80 hover:!bg-blue-200/80'} scale-[0.8] rounded-md border-0 border-blue-500 shadow-sm backdrop-blur-md {showFormulas
          ? 'border-2'
          : ''}"
        tooltip={$_('ui.toggle_function')}
        onclick={onToggleFormulas}
      >
        <SquareFunction />
      </Button.Action>
    {/if}
  </div>
{/if}
