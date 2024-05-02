<script lang="ts">
  import { isActive } from '$lib/stores/activityStore';
  import { globalStateStore, isInset } from '$lib/stores/globalStateStore';
  import type { Controls, Controller } from '$lib/utils/Controls';
  import { Slider } from '$lib/utils/Slider';
  import { Toggle } from '$lib/utils/Toggle';
  import { mdiPause, mdiRestart } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';
  import SideButton from './SideButton.svelte';
  import SvelteSlider from './Slider.svelte';
  import SvelteToggle from './Toggle.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let controls: Controls<G>;
  export let isPlaying = false;

  let sliderExpanded = 0;

  const dispatch = createEventDispatcher();

  /**
   * Select a slider to be expanded. But do not play it yet.
   */
  function expandIndex(index: number) {
    sliderExpanded = index;
    isPlaying = false;
  }
</script>

<div class="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all" class:inset={$isInset}>
  <div
    class="py-2 px-3 rounded-lg flex gap-1 items-center shadow-md bg-blue-50/70 backdrop-blur-md"
  >
    {#each controls.controls as controller, index}
      {#if controller instanceof Slider}
        <SvelteSlider
          bind:slider={controller}
          bind:isPlaying
          isExpanded={sliderExpanded == index}
          on:expand={() => expandIndex(index)}
          on:startChanging={() => globalStateStore.changeState({ controlsInteractive: true })}
          on:stopChanging={() => globalStateStore.changeState({ controlsInteractive: false })}
        />
      {:else if controller instanceof Toggle}
        <SvelteToggle bind:toggle={controller} />
      {/if}
    {/each}
  </div>

  <!-- NOTIFY -->
  <SideButton
    translate={$isActive
      ? 'left-1/2 -translate-x-1/2 top-5 scale-0'
      : 'left-1/2 -translate-x-1/2 -top-6 scale-100'}
    class="w-full text-nowrap"
    tooltip="Start the scene so you can interact"
  >
    <span class="text-xs p-2 text-blue-900">Click anywhere in the scene to start interacting</span>
  </SideButton>

  <!-- PAUSE SCENE -->
  <SideButton
    on:click={() => dispatch('pause')}
    translate={$isActive ? '-left-[4.5rem]' : 'left-1'}
    tooltip="Pause the scene so you can scroll again"
  >
    <span class="text-xs">Pause</span>
    <Icon path={mdiPause} />
  </SideButton>

  <!-- RESET SCENE -->
  <SideButton
    on:click={() => dispatch('reset')}
    translate={$isActive ? '-right-[4.5rem]' : 'right-1'}
    tooltip="Will reset sliders, toggles and scene"
  >
    <Icon path={mdiRestart} />
    <span class="text-xs">Reset</span>
  </SideButton>
</div>

<div />

<style lang="postcss">
  .inset {
    @apply m-0;
  }
</style>
