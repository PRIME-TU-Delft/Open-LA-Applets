<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { isActive } from '$lib/stores/activityStore';
  import type { Slider } from '$lib/utils/Slider';
  import { mdiPause, mdiPlay, mdiPlus } from '@mdi/js';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { generateUUID } from 'three/src/math/MathUtils.js';

  export let slider: Slider;
  export let isExpanded: boolean = false;
  export let isPlaying: boolean = false;
  export let playSpeed: number = 1000 / 16;

  let uuid = generateUUID();

  let icon = mdiPlay;
  let moveRight = false; // direction of the slider

  // interval for playing the slider
  let playInterval: NodeJS.Timeout; // eslint-disable-line no-undef

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

  $: {
    if (!$isActive) stopPlaying();
  }

  onDestroy(stopPlaying);
</script>

{#if !isExpanded}
  <!-- If not selected display only the expand button -->
  <div class="tooltip tooltip-top" data-tip="Extend slider">
    <Button.Action
      class="text-white"
      --bg={slider.color}
      icon={mdiPlus}
      tooltip="Expand slider"
      side="top"
      on:click={() => dispatch('expand')}
    />
  </div>
{:else}
  <!-- If the slider is selected / expanded -->
  <Button.Action
    class="text-white rounded-full"
    --bg={slider.color}
    {icon}
    tooltip="Toggle animation"
    side="top"
    on:click={togglePlay}
  />

  <div class="flex flex-col gap-1">
    {#if slider.label}
      <Label
        class="relative w-fit flex gap-1 items-center text-slate-700 text-xs pr-1"
        for="range-{uuid}"
        >{slider.label}:
        {#key slider.value}
          <p class="absolute left-full text-sm" style="color:{slider.color};">
            {slider.valueFn(slider.value)}
          </p>
        {/key}
      </Label>
    {/if}

    <input
      type="range"
      id="range-{uuid}"
      min={slider.min}
      max={slider.max}
      step={slider.stepSize}
      bind:value={slider.value}
      on:change={stopPlaying}
      on:mousedown={startChanging}
      on:touchstart={startChanging}
      style="accent-color: {slider.color}"
    />
  </div>
{/if}
