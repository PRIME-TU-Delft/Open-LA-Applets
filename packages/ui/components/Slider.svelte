<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { Icon } from 'mdi-svelte-ts';
  import { type Slider } from 'utils/Slider';
  import { mdiPlay, mdiPause } from '@mdi/js';
  import { onDestroy } from 'svelte';

  export let slider: Slider;
  export let isSelected: boolean = false;
  export let playSpeed: number = 1000 / 16;

  let icon = mdiPlay;

  let playInterval: NodeJS.Timer; // interval for playing the slider
  let isPlaying: boolean = false;
  let moveRight = false; // direction of the slider

  const dispatch = createEventDispatcher();

  function round() {
    slider.value = Math.round(slider.value / slider.stepSize) * slider.stepSize;
  }

  function stopPlaying() {
    isPlaying = false;
    clearInterval(playInterval);
    icon = mdiPlay;
    round();
  }

  function startPlaying() {
    playInterval = setInterval(() => {
      // Bounce the slider back and forth
      slider.value += ((moveRight ? -1 : 1) * slider.stepSize) / 4;

      if (slider.value >= slider.max) {
        moveRight = true;
      } else if (slider.value <= slider.min) {
        moveRight = false;
      }
    }, playSpeed);
    isPlaying = true;
    icon = mdiPause;
  }

  function togglePlay() {
    dispatch('indexSelected');

    if (isPlaying) {
      stopPlaying();
      dispatch('closeSelected');
    } else {
      startPlaying();
    }
  }

  $: if (!isSelected) {
    stopPlaying();
  }

  onDestroy(stopPlaying);
</script>

<button style="--color: {slider.color}" class="rounded-full p-4" on:click={togglePlay}>
  <Icon path={icon} color="white" size={1} />
</button>

{#if isSelected}
  <div class="flex" in:fade>
    <p class="title text-center text-black">{slider.value.toFixed(1)}</p>
    <label>
      <input
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.stepSize}
        bind:value={slider.value}
        on:change={stopPlaying}
        on:mousedown={stopPlaying}
        on:touchstart={stopPlaying}
        style="--color: {slider.color}"
      />
    </label>
  </div>
{/if}

<style>
  .title {
    min-width: 2.5rem;
  }

  button {
    background: var(--color, #000);
  }

  label {
    display: grid;
    width: 100%;
  }

  input {
    accent-color: var(--color);
    width: inherit;
  }
</style>
