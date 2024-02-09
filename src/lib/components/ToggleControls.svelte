<script lang="ts">
  import type { Controls } from '$lib/utils/Controls';
  import { Slider } from '$lib/utils/Slider';
  import ToggleSlider from './Slider.svelte';

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
    <ToggleSlider
      bind:slider={controller}
      bind:isPlaying
      isExpanded={sliderExpanded == index}
      on:expand={() => expandIndex(index)}
      on:startChanging
      on:stopChanging
    />
  {:else}
    <p>Unknown control type</p>
  {/if}
{/each}
