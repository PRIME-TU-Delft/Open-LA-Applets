<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  import { Icon } from 'mdi-svelte-ts';
  import { type Slider } from 'utils/Slider';
  import { mdiPlay, mdiPause, mdiPlus } from '@mdi/js';

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
  <button
    style="background: {slider.color}"
    class="rounded p-4"
    on:click={() => dispatch('expand')}
  >
    <Icon path={mdiPlus} color="white" size={1} />
  </button>
{:else}
  <!-- If the slider is selected / expanded -->
  <button style="background: {slider.color}" class="rounded-full p-4" on:click={togglePlay}>
    <Icon path={icon} color="white" size={1} />
  </button>

  <label class="flex w-full">
    <input
      type="range"
      min={slider.min}
      max={slider.max}
      step={slider.stepSize}
      bind:value={slider.value}
      on:change={stopPlaying}
      on:mousedown={startChanging}
      on:touchstart={startChanging}
      style="accent-color: {slider.color}"
      class="w-inherit"
    />
  </label>
{/if}
