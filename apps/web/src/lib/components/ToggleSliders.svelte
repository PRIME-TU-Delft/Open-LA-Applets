<script lang="ts">
  import { Sliders } from '$lib/utils/Slider';
  import ToggleSlider from './Slider.svelte';

  export let sliders: Sliders;
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

{#each sliders.sliders as slider, index}
  <ToggleSlider
    bind:slider
    bind:isPlaying
    isExpanded={sliderExpanded == index}
    on:expand={() => expandIndex(index)}
    on:startChanging
    on:stopChanging
  />
{/each}
