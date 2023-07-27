<script lang="ts">
  import { mdiPause, mdiPlay, mdiPlus } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import type { Slider } from '$lib/utils/Slider';
  import RoundButton from './RoundButton.svelte';

  export let slider: Slider;
  export let isExpanded: boolean = false;
  export let isPlaying: boolean = false;
  export let playSpeed: number = 1000 / 16;

  let icon = mdiPlay;
  let playInterval: NodeJS.Timer; // interval for playing the slider
  let moveRight = false; // direction of the slider

  const dispatch = createEventDispatcher();

  function round() {
    slider.value = Math.round(slider.value / slider.stepSize) * slider.stepSize;
  }

  function stopPlaying() {
    isPlaying = false;
    icon = mdiPlay;

    clearInterval(playInterval);
    round();
    dispatch('stopChanging');
  }

  function startPlaying() {
    isPlaying = true;
    icon = mdiPause;

    playInterval = setInterval(() => {
      // Bounce the slider back and forth
      slider.value += ((moveRight ? -1 : 1) * slider.stepSize) / 4;

      if (slider.value >= slider.max) {
        moveRight = true;
      } else if (slider.value <= slider.min) {
        moveRight = false;
      }
    }, playSpeed);
  }

  function togglePlay() {
    if (isPlaying) stopPlaying();
    else startPlaying();
  }

  function startChanging() {
    stopPlaying();

    dispatch('startChanging');
  }

  $: {
    if (!isPlaying) stopPlaying();
  }

  onDestroy(stopPlaying);
</script>

{#if !isExpanded}
  <!-- If not selected display only the expand button -->
  <div class="tooltip tooltip-top" data-tip="Extend slider">
    <RoundButton
      --bg={slider.color}
      icon={mdiPlus}
      color="white"
      on:click={() => dispatch('expand')}
    />
  </div>
{:else}
  <!-- If the slider is selected / expanded -->
  <div class="tooltip tooltip-top" data-tip="Toggle animation">
    <button style="background: {slider.color}" class="rounded-full p-4" on:click={togglePlay}>
      <Icon path={icon} color="white" size={1} />
    </button>
  </div>

  <label class="w-full">
    <input
      type="range"
      min={slider.min}
      max={slider.max}
      step={slider.stepSize}
      bind:value={slider.value}
      on:change={stopPlaying}
      on:mousedown={startChanging}
      on:touchstart={startChanging}
      style="accent-color: {slider.color}; --s: {slider.hsl.h} {slider.hsl.s}% {slider.hsl.l}%;"
      class="w-inherit range range-xs range-secondary"
    />
  </label>
{/if}
