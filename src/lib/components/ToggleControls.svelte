<script lang="ts">
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

{#each controls.controls as controller, index}
  {#if controller instanceof Slider}
    <SvelteSlider
      bind:slider={controller}
      bind:isPlaying
      isExpanded={sliderExpanded == index}
      on:expand={() => expandIndex(index)}
      on:startChanging
      on:stopChanging
    />
  {:else if controller instanceof Toggle}
    <SvelteToggle bind:toggle={controller} />
  {/if}
{/each}
