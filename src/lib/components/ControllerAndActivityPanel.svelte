<script lang="ts" generics="State">
  import SvelteButton from '$lib/components/Button.svelte';
  import SideButton from '$lib/components/SideButton.svelte';
  import * as ShadCNButton from '$lib/components/ui/button';
  import { Button } from '$lib/controls/Button.svelte';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { DiagonalMatrix } from '$lib/controls/DiagonalMatrix.svelte';
  import { Dropdown } from '$lib/controls/Dropdown.svelte';
  import { Matrix } from '$lib/controls/Matrix.svelte';
  import { Slider } from '$lib/controls/Slider.svelte';
  import { SlideShow } from '$lib/controls/SlideShow.svelte';
  import { Toggle } from '$lib/controls/Toggle.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import Lock from '@lucide/svelte/icons/lock';
  import Unlock from '@lucide/svelte/icons/lock-open';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import * as C from './controls';
  import { cn } from '$lib/utils';

  type G = readonly Controller<number | boolean | string | State>[];
  type ControllerAndActivityPanelProps = {
    controls: Controls<State, G>;
    onLock: (e: MouseEvent | CustomEvent) => void;
    onReset: () => void;
  };

  let { controls, onLock, onReset }: ControllerAndActivityPanelProps = $props();

  let sliderExpanded = $state(0);
  /**
   * Select a slider to be expanded. But do not play it yet.
   */
  function expandIndex(index: number) {
    sliderExpanded = index;
  }
  function minimizeSlider() {
    sliderExpanded = -1;
  }
</script>

<div
  class={cn(
    'absolute bottom-2 left-1/2 w-max max-w-4/5 -translate-x-1/2 transition-all',
    globalState.isInset() && 'm-0'
  )}
>
  <div
    class="flex items-center gap-1 rounded-lg bg-blue-50/70 px-3 py-2 shadow-md backdrop-blur-md"
  >
    {#each controls.controls as controller, index (index)}
      {#if controller instanceof Slider}
        <C.Slider
          bind:value={controller.value}
          slider={controller}
          isExpanded={sliderExpanded == index}
          onExpand={() => expandIndex(index)}
          onMinimize={() => minimizeSlider()}
          onStartChanging={() => globalState.changeState({ controlsInteractive: true })}
          onStopChanging={() => globalState.changeState({ controlsInteractive: false })}
        />
      {:else if controller instanceof Toggle && controller.isSwitch}
        <C.Switch switch={controller} />
      {:else if controller instanceof Toggle}
        <C.Toggle bind:value={controller.value} toggle={controller} />
      {:else if controller instanceof SlideShow}
        <C.SlideShow {controller} />
      {:else if controller instanceof Dropdown}
        <C.Dropdown {controller} />
      {:else if controller instanceof Button}
        <SvelteButton
          label={controller.label || ''}
          color={controller.color}
          action={controller.action}
        />
      {:else if controller instanceof DiagonalMatrix}
        <C.DiagonalMatrix {controller} />
      {:else if controller instanceof Matrix}
        <C.Matrix {controller} />
      {/if}
    {/each}
  </div>

  <!-- NOTIFY -->
  <SideButton
    translate={activityState.isActive
      ? 'left-1/2 -translate-x-1/2 top-5 scale-0'
      : 'left-1/2 -translate-x-1/2  -top-7 sm:-top-6 scale-100 motion-safe:hover:scale-105'}
    class="h-full w-full text-nowrap"
    tooltip="Start the scene so you can interact"
  >
    <div
      class="relative flex min-w-[16rem] items-center gap-2 px-4 py-1 text-center text-xs text-balance sm:text-nowrap"
    >
      <ShadCNButton.Action class="h-6 w-6" tooltip="Lock scene">
        <Unlock class="h-6 w-6 rounded-sm bg-blue-200 p-1 transition-colors hover:bg-blue-300" />
      </ShadCNButton.Action>
      Click anywhere in the scene to start interacting
      <span class="absolute -top-1 -right-1 flex h-3 w-3">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
        ></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
      </span>
    </div>
  </SideButton>

  <!-- LOCK SCENE -->
  <SideButton
    onclick={(e) => onLock(e)}
    translate={activityState.isActive
      ? '-left-12 sm:-left-[4.5rem] opacity-100'
      : 'left-1 opacity-50'}
    tooltip="Lock the scene so you can scroll again"
    class="w-10 sm:w-16"
  >
    <span class="mr-0.5 hidden text-xs sm:block">Lock</span>
    <Lock class="h-4 w-4" />
  </SideButton>

  <!-- RESET SCENE -->
  <SideButton
    onclick={onReset}
    translate={activityState.isActive
      ? '-right-12 sm:-right-[4.5rem] opacity-100'
      : 'right-1 opacity-50'}
    tooltip="Will reset sliders, toggles and scene"
    class="w-10 sm:w-16"
  >
    <RotateCcw class="h-4 w-4" />
    <span class="ml-0.5 hidden text-xs sm:block">Reset</span>
  </SideButton>
</div>
