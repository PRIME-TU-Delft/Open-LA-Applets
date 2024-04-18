<script lang="ts">
  import { globalStateStore, isInset } from '$lib/stores/globalStateStore';
  import type { Controls } from '$lib/utils/Controls';
  import { Slider } from '$lib/utils/Slider';
  import { Toggle } from '$lib/utils/Toggle';
  import SvelteSlider from './Slider.svelte';
  import SvelteToggle from './Toggle.svelte';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let controls: Controls<G>;
  export let isPlaying = false;

  let sliderExpanded = 0;

  /**
   * Select a slider to be expanded. But do not play it yet.
   */
  function expandIndex(index: number) {
    sliderExpanded = index;
    isPlaying = false;
  }
</script>

<div
  class="flex gap-1 py-2 px-3 bg-slate-200 rounded-lg absolute bottom-0 right-0 transition-all items-center border-none"
  class:inset={$isInset}
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

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
