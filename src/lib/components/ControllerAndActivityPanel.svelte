<script lang="ts" generics="State">
  import * as Button from '$lib/components/ui/button';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import { Dropdown } from '$lib/controls/Dropdown.svelte';
  import { Slider } from '$lib/controls/Slider.svelte';
  import { SlideShow } from '$lib/controls/SlideShow.svelte';
  import { Toggle } from '$lib/controls/Toggle.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { Lock, RotateCcw, Unlock } from 'lucide-svelte';
  import SvelteDropdown from '$lib/components/Dropdown.svelte';
  import SideButton from '$lib/components/SideButton.svelte';
  import SvelteSlider from '$lib/components/Slider.svelte';
  import SvelteSlideShow from '$lib/components/SlideShow.svelte';
  import SvelteToggle from '$lib/components/Toggle.svelte';

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
</script>

<div
  class="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all"
  class:inset={globalState.isInset()}
>
  <div
    class="py-2 px-3 rounded-lg flex gap-1 items-center shadow-md bg-blue-50/70 backdrop-blur-md"
  >
    {#each controls.controls as controller, index}
      {#if controller instanceof Slider}
        <SvelteSlider
          bind:value={controller.value}
          slider={controller}
          isExpanded={sliderExpanded == index}
          onExpand={() => expandIndex(index)}
          onStartChanging={() => globalState.changeState({ controlsInteractive: true })}
          onStopChanging={() => globalState.changeState({ controlsInteractive: false })}
        />
      {:else if controller instanceof Toggle}
        <SvelteToggle bind:value={controller.value} toggle={controller} />
      {:else if controller instanceof SlideShow}
        <SvelteSlideShow {controller} />
      {:else if controller instanceof Dropdown}
        <SvelteDropdown {controller} />
      {/if}
    {/each}
  </div>

  <!-- NOTIFY -->
  <SideButton
    translate={activityState.isActive
      ? 'left-1/2 -translate-x-1/2 top-5 scale-0'
      : 'left-1/2 -translate-x-1/2 -top-6 scale-100 motion-safe:hover:scale-105'}
    class="w-full text-nowrap"
    tooltip="Start the scene so you can interact"
  >
    <div
      class="px-4 py-1 relative sm:text-nowrap text-balance text-center items-center flex gap-2 text-xs"
    >
      <Button.Action class="w-6 h-6" tooltip="Lock scene">
        <Unlock class="bg-blue-200 hover:bg-blue-300 p-1 w-6 h-6 rounded-sm transition-colors" />
      </Button.Action>
      Click anywhere in the scene to start interacting
      <span class="absolute -right-1 -top-1 flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
      </span>
    </div>
  </SideButton>

  <!-- LOCK SCENE -->
  <SideButton
    onclick={(e) => onLock(e)}
    translate={activityState.isActive ? '-left-[4.5rem] opacity-100' : 'left-1 opacity-50'}
    tooltip="Lock the scene so you can scroll again"
  >
    <span class="text-xs mr-0.5">Lock</span>
    <Lock class="h-4 w-4" />
  </SideButton>

  <!-- RESET SCENE -->
  <SideButton
    onclick={onReset}
    translate={activityState.isActive ? '-right-[4.5rem] opacity-100' : 'right-1 opacity-50'}
    tooltip="Will reset sliders, toggles and scene"
  >
    <RotateCcw class="h-4 w-4" />
    <span class="ml-0.5 text-xs">Reset</span>
  </SideButton>
</div>

<style lang="postcss">
  .inset {
    @apply m-0;
  }
</style>
